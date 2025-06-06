import songModel from "../models/song.model.js";
import sequelize from "../configs/db.js";

const getAllSongs = async (req, res) => {
  try {
    const allSongs = await songModel.findAll({
      order: [["createdAt", "DESC"]],
    });

    if (!allSongs || allSongs.length === 0) {
      res.status(400).json({ message: "There is no song now" });
    }

    res.status(200).json(allSongs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTrendingSongs = async (req, res) => {
  try {
    const featuredSongs = await songModel.findAll({
      order: [sequelize.literal("RAND()")],
      limit: 10,
    });

    if (!featuredSongs || featuredSongs.length === 0) {
      res.status(400).json({ message: "There is no song now" });
    }

    res.status(200).json(featuredSongs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getAllSongs,
  getTrendingSongs,
};
