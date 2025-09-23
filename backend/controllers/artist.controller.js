import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import redis from "../configs/redis.js";
import artistModel from "../models/artist.model.js";
import songModel from "../models/song.model.js";
import albumController from "./album.controller.js";

import sequelize from "../configs/db.js";

const getAllSongsOfArtist = async (req, res) => {
  try {
    const { artistId } = req.params;

    const artist = await artistModel.findByPk(artistId);

    if (!artist) {
      return res.status(404).json({ message: "Artist not founded" });
    }

    const cachedAllSongs = await redis.get(`artist:all-songs:${artistId}`);

    if (cachedAllSongs) {
      return res.status(200).json(cachedAllSongs);
    }

    const allSongs = await artistModel.findByPk(artistId, {
      include: [
        {
          model: songModel,
        },
      ],
      order: [[songModel, "id", "ASC"]],
    });

    const allSongsPlain = allSongs.get({ plain: true });

    allSongsPlain.Songs = allSongsPlain.Songs.map((song) => ({
      ...song,
      artist: allSongsPlain.artist ? allSongsPlain.artist : null,
    }));

    await redis.setex(
      `artist:all-songs:${artistId}`,
      300,
      JSON.stringify(allSongsPlain)
    );

    res.status(200).json(allSongsPlain);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllArtists = async (req, res) => {
  try {
    const cachedAllArtists = await redis.get("artists:all-artists");

    if (cachedAllArtists) {
      return res.status(200).json(cachedAllArtists);
    }

    const allArtists = await artistModel.findAll({
      order: [sequelize.literal("RAND()")],
      limit: 10,
    });

    if (!allArtists || allArtists.length === 0) {
      return res.status(400).json({ message: "There is no artist now" });
    }

    await redis.setex("artists:all-artists", 300, JSON.stringify(allArtists));

    res.status(200).json(allArtists);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const createArtist = async (req, res) => {
  try {
    if (!req.files || !req.files.artistImageFile) {
      return res
        .status(400)
        .json({ message: "Please upload artist image file" });
    }

    const { artist } = req.body;

    const artistImageFile = req.files.artistImageFile;

    const artistImageUrl = await uploadToCloudinary(artistImageFile);

    const newArtist = await artistModel.create({
      artist,
      imageUrl: artistImageUrl,
    });

    await redis.del("admin:artist-stats");

    res
      .status(201)
      .json({ message: "Create artist successfully", newArtist: newArtist });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateArtist = async (req, res) => {
  try {
    const { artistId } = req.params;

    const { artist } = req.body;

    const artistImageFile = req.files ? req.files.artistImageFile : null;

    const oldArtist = await artistModel.findByPk(artistId);

    if (!oldArtist) {
      return res.status(404).json({ message: "Artist not founded" });
    }

    if (artistImageFile) {
      const newArtistImageUrl = await uploadToCloudinary(artistImageFile);

      oldArtist.imageUrl = newArtistImageUrl;
    }

    oldArtist.artist = artist !== "" ? artist : oldArtist.artist;

    await oldArtist.save();

    await redis.del("admin:artist-stats");

    res.status(200).json({
      message: "Update artist successfully",
      updatedArtist: oldArtist,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getAllSongsOfArtist,
  getAllArtists,
  createArtist,
  updateArtist,
};
