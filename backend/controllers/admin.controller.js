import songModel from "../models/song.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import userModel from "../models/user.model.js";
import paymentModel from "../models/payment.model.js";
import playlistModel from "../models/playlist.model.js";
import sequelize from "../configs/db.js";
import redis from "../configs/redis.js";
import { getIO, getUserSocketId } from "../configs/socket.js";

const getUserStats = async (req, res) => {
  try {
    const cachedUserStats = await redis.get("admin:user-stats");

    if (cachedUserStats) {
      return res.status(200).json(cachedUserStats);
    }

    const userStats = await userModel.findAll({
      attributes: {
        exclude: ["password", "salt"],
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM playlists AS p
              WHERE p.userId = User.id
            )`),
            "playlistCount",
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM wishlists AS w
              WHERE w.userId = User.id
            )`),
            "wishlistCount",
          ],
        ],
      },
    });

    if (!userStats) {
      return res.status(400).json({ message: "UserStats not founded" });
    }

    await redis.setex("admin:user-stats", 300, JSON.stringify(userStats));

    res.status(200).json(userStats);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not exists" });
    }

    if (user.isBlocked) {
      return res.status(200).json({ message: "User was blocked" });
    }

    user.isBlocked = true;

    await user.save();

    await redis.del("admin:user-stats");

    const userSocketId = getUserSocketId(Number(userId));
    console.log(userSocketId);

    if (userSocketId) {
      getIO().to(userSocketId).emit("user_blocked", { userId });
      console.log("blocked done");
    }

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const unBlockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not exists" });
    }

    if (!user.isBlocked) {
      return res.status(200).json({ message: "User was unblocked" });
    }

    user.isBlocked = false;

    await user.save();

    await redis.del("admin:user-stats");

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSongStats = async (req, res) => {
  try {
    const cachedSongStats = await redis.get("admin:song-stats");

    if (cachedSongStats) {
      return res.status(200).json(cachedSongStats);
    }

    const songStats = await songModel.findAll({
      attributes: [
        "id",
        "title",
        "artist",
        "duration",
        "imageUrl",
        "createdAt",
        [
          sequelize.literal(`(
            SELECT COUNT(*) 
            FROM playlist_songs AS ps 
            WHERE ps.songId = Song.id
          )`),
          "playlistCount",
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*) 
            FROM wishlists AS w 
            WHERE w.songId = Song.id
          )`),
          "wishlistCount",
        ],
      ],
    });

    if (!songStats) {
      return res.status(400).json({ message: "SongStats not founded" });
    }

    await redis.setex("admin:song-stats", 300, JSON.stringify(songStats));

    res.status(200).json(songStats);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const createSong = async (req, res) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res
        .status(400)
        .json({ message: "Please upload audio and image files" });
    }

    const { title, artist } = req.body;
    const duration = Number(req.body.duration);

    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const newSong = songModel.build({
      title,
      artist,
      duration,
      audioUrl,
      imageUrl,
    });
    await newSong.save();

    await Promise.all([
      redis.del("admin:song-stats"),
      redis.del("admin:playlist-stats"),
      redis.del("artist-stats"),
    ]);

    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSong = async (req, res) => {
  try {
    const { songId } = req.params;

    const song = await songModel.findOne({ where: { id: songId } });

    if (!song) {
      return res.status(400).json({ message: "Song doesn't exists" });
    }

    await songModel.destroy({ where: { id: songId } });

    await Promise.all([
      redis.del("admin:song-stats"),
      redis.del("admin:playlist-stats"),
      redis.del("artist-stats"),
    ]);

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateSong = async (req, res) => {
  try {
    const { songId } = req.params;
    const { title, artist } = req.body;

    const song = await songModel.findOne({ where: { id: songId } });

    if (!song) {
      return res.status(404).json({ message: "Song not founded" });
    }

    song.title = title !== "" ? title : song.title;
    song.artist = artist !== "" ? artist : song.artist;

    await song.save();

    await Promise.all([
      redis.del("admin:song-stats"),
      redis.del("artist-stats"),
    ]);

    res.status(200).json({ message: "Song updated successfully", song });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPlaylistStats = async (req, res) => {
  try {
    const cachedPlaylistStats = await redis.get("admin:playlist-stats");

    if (cachedPlaylistStats) {
      return res.status(200).json(cachedPlaylistStats);
    }

    const playlistStats = await playlistModel.findAll({
      attributes: [
        "id",
        "name",
        "createdAt",
        [
          sequelize.literal(`(
            SELECT COUNT(*) 
            FROM playlist_songs AS ps 
            WHERE ps.playlistId = Playlist.id
          )`),
          "songCount",
        ],
        [
          sequelize.literal(`(
            SELECT u.username
            FROM users AS u
            WHERE u.id = Playlist.userId
          )`),
          "username",
        ],
      ],
    });

    if (!playlistStats) {
      return res.status(400).json({ message: "PlaylistStats not founded" });
    }

    await redis.setex(
      "admin:playlist-stats",
      300,
      JSON.stringify(playlistStats)
    );

    res.status(200).json(playlistStats);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getArtistStats = async (req, res) => {
  try {
    const cachedArtistStats = await redis.get("admin:artist-stats");

    if (cachedArtistStats) {
      return res.status(200).json(cachedArtistStats);
    }

    const artistStats = await songModel.findAll({
      attributes: [
        "artist",
        [sequelize.fn("COUNT", sequelize.col("Song.id")), "songCount"],
        [
          sequelize.literal(`(
            SELECT COUNT(DISTINCT ps.playlistId)
            FROM playlist_songs AS ps
            INNER JOIN songs AS s 
            ON s.id = ps.songId
            WHERE s.artist = Song.artist
          )`),
          "playlistCount",
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(DISTINCT w.userId)
            FROM wishlists AS w
            INNER JOIN songs AS s 
            ON s.id = w.songId
            WHERE s.artist = Song.artist
          )`),
          "wishlistCount",
        ],
      ],
      group: ["artist"],
    });

    if (!artistStats) {
      return res.status(400).json({ message: "ArtistStats not founded" });
    }

    await redis.setex("admin:artist-stats", 300, JSON.stringify(artistStats));

    res.status(200).json(artistStats);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPaymentStats = async (req, res) => {
  try {
    const cachedPaymentStats = await redis.get("admin:payment-stats");

    if (cachedPaymentStats) {
      return res.status(200).json(cachedPaymentStats);
    }

    const paymentStats = await paymentModel.findAll();

    if (!paymentStats || paymentStats.length === 0) {
      return res.status(400).json({ message: "PaymentStats not founded" });
    }

    const totalProfit = paymentStats.reduce(
      (sum, payment) => (payment.resultCode === 0 ? sum + payment.amount : sum),
      0
    );

    await redis.setex(
      "admin:payment-stats",
      300,
      JSON.stringify({ paymentStats, totalProfit })
    );

    res.status(200).json({ paymentStats, totalProfit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getUserStats,
  blockUser,
  unBlockUser,
  getSongStats,
  createSong,
  deleteSong,
  updateSong,
  getPlaylistStats,
  getArtistStats,
  getPaymentStats,
};
