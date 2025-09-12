import albumModel from "../models/album.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import redis from "../configs/redis.js";
import sequelize from "../configs/db.js";
import artistModel from "../models/artist.model.js";

const getAllAlbums = async (req, res) => {
  try {
    const cachedAllAlbums = await redis.get("album:all-albums");

    if (cachedAllAlbums) {
      return res.status(200).json(cachedAllAlbums);
    }

    const allAlbums = await albumModel.findAll({
      order: [sequelize.literal("RAND()")],
      limit: 10,
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT a.artist FROM artists AS a WHERE a.id = Album.artistId)`
            ),
            "artist",
          ],
        ],
      },
    });

    if (!allAlbums || allAlbums.length === 0) {
      return res.status(404).json({ message: "There is no album now" });
    }

    await redis.setex("album:all-albums", 300, JSON.stringify(allAlbums));

    res.status(200).json(allAlbums);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createAlbum = async (req, res) => {
  try {
    if (!req.files || !req.files.albumImageFile) {
      return res
        .status(400)
        .json({ message: "Please upload album image file" });
    }

    const { title, artistId } = req.body;

    const isValidArtistId = await artistModel.findByPk(artistId);

    if (!isValidArtistId) {
      return res.status(404).json({ message: "Artist not exist" });
    }

    const albumImageFile = req.files.albumImageFile;

    const albumImageUrl = await uploadToCloudinary(albumImageFile);

    const newAlbum = await albumModel.create({
      title,
      artistId,
      imageUrl: albumImageUrl,
    });

    await redis.del("admin:album-stats");

    res
      .status(201)
      .json({ message: "Create album successfully", newAlbum: newAlbum });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;

    const { title, artistId } = req.body;

    const albumImageFile = req.files ? req.files.albumImageFile : null;

    const [oldAlbum, isValidArtistId] = await Promise.all([
      albumModel.findByPk(albumId),
      artistModel.findByPk(artistId),
    ]);

    if (!oldAlbum) {
      return res.status(404).json({ message: "Album not found" });
    }
    if (!isValidArtistId) {
      return res.status(404).json({ message: "Artist not exist" });
    }

    if (albumImageFile) {
      const albumImageUrl = await uploadToCloudinary(albumImageFile);

      oldAlbum.imageUrl = albumImageUrl;
    }

    oldAlbum.title = title ? title : oldAlbum.title;
    oldAlbum.artistId = artistId ? Number(artistId) : oldAlbum.artistId;

    await oldAlbum.save();

    await redis.del("admin:album-stats");

    res
      .status(200)
      .json({ message: "Update album successfully", updatedAlbum: oldAlbum });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getAllAlbums,
  createAlbum,
  updateAlbum,
};
