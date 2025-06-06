import { DataTypes } from "sequelize";
import sequelize from "../configs/db.js";
import userModel from "./user.model.js";
import songModel from "./song.model.js";

const wishlistModel = sequelize.define(
  "Wishlist",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: userModel,
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
    tableName: "wishlists",
    timestamps: false,
  }
);

export default wishlistModel;
