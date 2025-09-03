import { DataTypes } from "sequelize";
import sequelize from "../configs/db.js";
import albumModel from "./album.model.js";
import artistModel from "./artist.model.js";

const songModel = sequelize.define(
  "Song",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    audioUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    artistId: {
      type: DataTypes.INTEGER,
      references: {
        model: artistModel,
        key: "id",
      },
      allowNull: true,
    },
    albumId: {
      type: DataTypes.INTEGER,
      references: {
        model: albumModel,
        key: "id",
      },
      allowNull: true,
    },
  },
  {
    tableName: "songs",
    timestamps: true,
  }
);

export default songModel;
