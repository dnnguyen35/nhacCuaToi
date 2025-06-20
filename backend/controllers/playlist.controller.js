import playlistModel from "../models/playlist.model.js";
import songModel from "../models/song.model.js";
import playlistSongModel from "../models/playlistSong.model.js";

const createPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playlistName } = req.body;

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

    res.status(201).json(newPlaylist);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPlaylistsOfUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const allPlaylists = await playlistModel.findAll({ where: { userId } });

    res.status(200).json(allPlaylists);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllSongsOfPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

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

    res.status(200).json(allSongs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await playlistModel.findOne({ where: { id: playlistId } });

    if (!playlist) {
      return res.status(400).json({ message: "Playlist doesn't exists" });
    }

    await playlistSongModel.destroy({ where: { playlistId } });

    await playlistModel.destroy({ where: { id: playlistId } });

    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params;

    await playlistSongModel.destroy({
      where: {
        playlistId: playlistId,
        songId: songId,
      },
    });

    res
      .status(200)
      .json({ message: "Removed song from playlist successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params;

    const isExist = await playlistSongModel.findOne({
      where: { playlistId, songId },
    });

    if (isExist) {
      return res.status(400).json({ message: "Song has been alredy added" });
    }

    const playlistExist = await playlistModel.findOne({
      where: { id: playlistId },
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

    res.status(201).json(songExist);
  } catch (error) {
    console.log(error);
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
};
