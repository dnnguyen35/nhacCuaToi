import { DataTypes } from "sequelize";
import sequelize from "../configs/db.js";

const artistModel = sequelize.define(
  "Artist",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "artists",
    timestamps: true,
  }
);

export default artistModel;
