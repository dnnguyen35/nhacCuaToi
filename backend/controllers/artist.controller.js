import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import redis from "../configs/redis.js";
import artistModel from "../models/artist.model.js";

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
  createArtist,
  updateArtist,
};
