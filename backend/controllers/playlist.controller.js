import playlistModel from "../models/playlist.model.js";
import songModel from "../models/song.model.js";
import playlistSongModel from "../models/playlistSong.model.js";
import redis from "../configs/redis.js";

const createPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const userPlaylistLimit = req.user.playlistLimit;
    const { playlistName } = req.body;

    const playlistCount = await playlistModel.count({
      where: {
        userId,
      },
    });

    if (playlistCount >= userPlaylistLimit) {
      return res
        .status(400)
        .json({ message: "You have exceed 5 playlist slot" });
    }

    const isPlaylistExist = await playlistModel.findOne({
      where: {
        name: playlistName,
        userId,
      },
    });

    if (isPlaylistExist) {
      return res.status(400).json({ message: "Playlist already existed" });
    }

    const newPlaylist = await playlistModel.create({
      name: playlistName,
      userId,
    });

    await redis.del(`playlist:all-playlists:${userId}`);

    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPlaylistsOfUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const cachedAllplaylists = await redis.get(
      `playlist:all-playlists:${userId}`
    );

    if (cachedAllplaylists) {
      return res.status(200).json(cachedAllplaylists);
    }

    const allPlaylists = await playlistModel.findAll({ where: { userId } });

    await redis.setex(
      `playlist:all-playlists:${userId}`,
      300,
      JSON.stringify(allPlaylists)
    );

    res.status(200).json(allPlaylists);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllSongsOfPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user.id;

    const playlist = await playlistModel.findOne({
      where: { id: playlistId, userId },
    });

    if (!playlist) {
      return res.status(403).json({ message: "Access denied" });
    }

    const cachedAllSongs = await redis.get(`playlist:all-songs:${playlistId}`);

    if (cachedAllSongs) {
      return res.status(200).json(cachedAllSongs);
    }

    const allSongs = await playlistModel.findByPk(playlistId, {
      include: [
        {
          model: songModel,
          through: { attributes: [] },
        },
      ],
      order: [[songModel, playlistSongModel, "id", "ASC"]],
    });

    if (!allSongs) {
      return res.status(400).json({ message: "Playlist doesn't exists" });
    }

    await redis.setex(
      `playlist:all-songs:${playlistId}`,
      300,
      JSON.stringify(allSongs)
    );

    res.status(200).json(allSongs);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const userId = req.user.id;

    const playlist = await playlistModel.findOne({
      where: { id: playlistId, userId },
    });

    if (!playlist) {
      return res.status(400).json({ message: "Playlist doesn't exists" });
    }

    await playlistSongModel.destroy({ where: { playlistId } });

    await Promise.all([
      playlistModel.destroy({ where: { id: playlistId } }),
      redis.del(`playlist:all-playlists:${userId}`),
      redis.del(`playlist:all-songs:${playlistId}`),
    ]);

    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params;

    const userId = req.user.id;

    const playlist = await playlistModel.findOne({
      where: { id: playlistId, userId },
    });

    if (!playlist) {
      return res.status(400).json({ message: "Access denied" });
    }

    await Promise.all([
      playlistSongModel.destroy({
        where: {
          playlistId: playlistId,
          songId: songId,
        },
      }),
      redis.del(`playlist:all-songs:${playlistId}`),
    ]);

    res
      .status(200)
      .json({ message: "Removed song from playlist successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params;

    const userId = req.user.id;

    const isExist = await playlistSongModel.findOne({
      where: { playlistId, songId },
    });

    if (isExist) {
      return res.status(400).json({ message: "Song has been alredy added" });
    }

    const playlistExist = await playlistModel.findOne({
      where: { id: playlistId, userId },
    });
    const songExist = await songModel.findOne({ where: { id: songId } });

    if (!playlistExist || !songExist) {
      return res
        .status(400)
        .json({ message: "Playlist or song does not exist" });
    }

    await playlistSongModel.create({
      playlistId,
      songId,
    });

    await redis.del(`playlist:all-songs:${playlistId}`);

    res.status(201).json(songExist);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteMultipleSongFromPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const playlistId = req.body.playlistId;
    const deletedSongList = req.body.deletedSongListId;

    const playlist = await playlistModel.findOne({
      where: { userId, id: playlistId },
    });

    if (!playlist) {
      return res.status(400).json({ message: "Access denied" });
    }

    if (!Array.isArray(deletedSongList) || deletedSongList?.length === 0) {
      return res
        .status(400)
        .json({ message: "Deleted song list must be array" });
    }

    await playlistSongModel.destroy({
      where: {
        playlistId,
        songId: deletedSongList,
      },
    });

    await redis.del(`playlist:all-songs:${playlistId}`);

    res
      .status(200)
      .json({ message: "Removed song from playlist successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createPlaylist,
  getAllPlaylistsOfUser,
  getAllSongsOfPlaylist,
  deletePlaylist,
  deleteSongFromPlaylist,
  addSongToPlaylist,
  deleteMultipleSongFromPlaylist,
};
