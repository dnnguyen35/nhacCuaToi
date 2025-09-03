import { DataTypes } from "sequelize";
import sequelize from "../configs/db.js";
import artistModel from "./artist.model.js";

const albumModel = sequelize.define(
  "Album",
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
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: artistModel,
        key: "id",
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "albums",
    timestamps: true,
  }
);

export default albumModel;
