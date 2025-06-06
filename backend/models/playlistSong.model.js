import { DataTypes } from "sequelize";
import sequelize from "../configs/db.js";
import playlistModel from "./playlist.model.js";
import songModel from "./song.model.js";

const playlistSongModel = sequelize.define(
  "PlaylistSong",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    playlistId: {
      type: DataTypes.INTEGER,
      references: {
        model: playlistModel,
        key: "id",
      },
      allowNull: false,
    },
    songId: {
      type: DataTypes.INTEGER,
      references: {
        model: songModel,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    tableName: "playlist_songs",
    timestamps: false,
  }
);

export default playlistSongModel;
