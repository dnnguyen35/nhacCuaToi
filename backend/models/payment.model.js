import { DataTypes } from "sequelize";
import sequelize from "../configs/db.js";
import userModel from "./user.model.js";

const paymentModel = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderInfo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountBankId: {
      type: DataTypes.STRING,
    },
    resultCode: {
      type: DataTypes.INTEGER,
    },
    message: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "uncompleted"),
      defaultValue: "pending",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: userModel,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    tableName: "payments",
    timestamps: true,
  }
);

export default paymentModel;
