import songModel from "../models/song.model.js";
import sequelize from "../configs/db.js";
import { Op } from "sequelize";

import redis from "../configs/redis.js";

const getAllSongs = async (req, res) => {
  try {
    const cachedAllSongs = await redis.get("songs:all-songs");

    if (cachedAllSongs) {
      return res.status(200).json(cachedAllSongs);
    }

    const allSongs = await songModel.findAll({
      order: [["createdAt", "DESC"]],
    });

    if (!allSongs || allSongs.length === 0) {
      return res.status(400).json({ message: "There is no song now" });
    }

    await redis.setex("songs:all-songs", 300, JSON.stringify(allSongs));

    res.status(200).json(allSongs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTrendingSongs = async (req, res) => {
  try {
    const cachedFeaturedSongs = await redis.get("songs:trending-songs");

    if (cachedFeaturedSongs) {
      return res.status(200).json(cachedFeaturedSongs);
    }

    const featuredSongs = await songModel.findAll({
      order: [sequelize.literal("RAND()")],
      limit: 10,
    });

    if (!featuredSongs || featuredSongs.length === 0) {
      return res.status(400).json({ message: "There is no song now" });
    }

    await redis.setex(
      "songs:trending-songs",
      300,
      JSON.stringify(featuredSongs)
    );

    res.status(200).json(featuredSongs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchSong = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 3 } = req.query;

    if (!keyword || keyword === "") {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows: searchResult, count: totalRows } =
      await songModel.findAndCountAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${keyword}%` } },
            { artist: { [Op.like]: `%${keyword}%` } },
          ],
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
      });

    res.status(200).json({
      searchResult,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalRows / parseInt(limit)),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getAllSongs,
  getTrendingSongs,
  searchSong,
};
