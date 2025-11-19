import songModel from "../models/song.model.js";
import artistModel from "../models/artist.model.js";
import albumModel from "../models/album.model.js";
import sequelize from "../configs/db.js";
import { Op } from "sequelize";
import redis from "../configs/redis.js";
import playlistModel from "../models/playlist.model.js";
import userModel from "../models/user.model.js";

const searchAllTypes = async (req, res) => {
  try {
    const { keyword, type } = req.query;

    if (!keyword || keyword === "") {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const validTypes = ["album", "artist", "song", "playlist"];
    let types = type ? type.split(",") : [...validTypes];

    types = types.filter((t) => validTypes.includes(t));

    if (types.length === 0) {
      return res.status(400).json({ message: "Type is required" });
    }

    const cacheKey = `searchResult:${keyword}:${types.join(",")}`;
    const cachedSearchResult = await redis.get(cacheKey);

    if (cachedSearchResult) {
      return res.status(200).json({ searchResult: cachedSearchResult });
    }

    const searchResult = { Songs: [], Albums: [], Artists: [], Playlists: [] };

    if (types.includes("song")) {
      searchResult.Songs = await songModel.findAll({
        include: [
          {
            model: artistModel,
            attributes: ["id", "artist"],
            required: false,
          },
        ],
        where: {
          [Op.or]: [
            sequelize.literal(
              `title COLLATE utf8mb4_0900_as_ci LIKE '%${keyword}%'`
            ),
            sequelize.literal(
              `Artist.artist COLLATE utf8mb4_0900_as_ci LIKE '%${keyword}%'`
            ),
          ],
        },
        order: [["createdAt", "DESC"]],
        attributes: {
          include: [[sequelize.col("Artist.artist"), "artist"]],
        },
      });
    }

    if (types.includes("album")) {
      const searchAlbums = await albumModel.findAll({
        include: [
          {
            model: artistModel,
            attributes: ["id", "artist"],
            required: false,
          },
          {
            model: songModel,
            required: false,
          },
        ],
        where: {
          [Op.or]: [
            sequelize.literal(
              `Album.title COLLATE utf8mb4_0900_as_ci LIKE '%${keyword}%'`
            ),
            sequelize.literal(
              `Artist.artist COLLATE utf8mb4_0900_as_ci LIKE '%${keyword}%'`
            ),
          ],
        },
        order: [["createdAt", "DESC"]],
        attributes: {
          include: [[sequelize.col("Artist.artist"), "artist"]],
        },
      });

      let searchAlbumsPlain = searchAlbums.map((a) => a.toJSON());

      searchAlbumsPlain = searchAlbumsPlain.map((a) => {
        const songs = a.Songs.map((s) => ({
          ...s,
          artist: a.artist,
        }));

        return {
          ...a,
          Songs: songs,
        };
      });

      searchResult.Albums = searchAlbumsPlain;
    }

    if (types.includes("artist")) {
      const searchArtists = await artistModel.findAll({
        include: [
          {
            model: songModel,
            required: false,
          },
        ],
        where: {
          [Op.or]: [
            sequelize.literal(
              `artist COLLATE utf8mb4_0900_as_ci LIKE '%${keyword}%'`
            ),
          ],
        },
        order: [["createdAt", "DESC"]],
      });

      let searchArtistsPlain = searchArtists.map((a) => a.toJSON());

      searchArtistsPlain = searchArtistsPlain.map((a) => {
        const songs = a.Songs.map((s) => ({
          ...s,
          artist: a.artist,
        }));

        return {
          ...a,
          Songs: songs,
        };
      });

      searchResult.Artists = searchArtistsPlain;
    }

    if (types.includes("playlist")) {
      const searchPublicPlaylists = await playlistModel.findAll({
        where: {
          isPublic: true,
          [Op.or]: [
            sequelize.literal(
              `Playlist.name COLLATE utf8mb4_0900_as_ci LIKE '%${keyword}%'`
            ),
            sequelize.literal(
              `User.username COLLATE utf8mb4_0900_as_ci LIKE '%${keyword}%'`
            ),
          ],
        },
        order: [["createdAt", "ASC"]],
        include: [
          {
            model: songModel,
            through: { attributes: [] },
            include: [
              {
                model: artistModel,
                attributes: ["artist"],
                required: false,
              },
            ],
          },
          {
            model: userModel,
            attributes: [["username", "createdBy"]],
            required: false,
          },
        ],
      });

      let searchPublicPlaylistsPlain = searchPublicPlaylists.map((playlist) =>
        playlist.get({ plain: true })
      );

      searchPublicPlaylistsPlain.forEach((playlist) => {
        playlist.createdBy = playlist?.User?.createdBy
          ? playlist.User.createdBy
          : null;

        playlist.Songs = playlist.Songs.map((song) => ({
          ...song,
          artist: song.Artist ? song.Artist.artist : null,
        }));
      });

      searchResult.Playlists = searchPublicPlaylistsPlain;
    }

    await redis.setex(cacheKey, 3600, JSON.stringify(searchResult));

    res.status(200).json({ searchResult });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  searchAllTypes,
};
