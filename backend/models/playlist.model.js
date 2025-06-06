import { DataTypes } from "sequelize";
import sequelize from "../configs/db.js";
import userModel from "./user.model.js";

const playlistModel = sequelize.define(
  "Playlist",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: userModel,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    tableName: "playlists",
    timestamps: true,
  }
);

export default playlistModel;
