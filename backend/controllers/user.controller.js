import userModel from "../models/user.model.js";
import songModel from "../models/song.model.js";
import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";

import { sendEmail } from "../utils/sendEmail.js";

const otpStore = new Map();

const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const isEmailExist = await userModel.findOne({ where: { email } });
    if (isEmailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(email, { otp, username, password, expiresAt });

    console.log("email sending");

    await sendEmail(email, username, otp);

    console.log("email send");

    return res.status(200).json({ message: "OTP has beeen send to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOtpAndSignup = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const data = otpStore.get(email);

    if (!data || data.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (data.otp !== otp) {
      return res.status(400).json({ message: "OTP not match" });
    }

    const { username, password } = data;

    const newUser = userModel.build({ email, username });

    newUser.setPassword(password);

    await newUser.save();

    otpStore.delete(email);

    const access_token = jsonwebtoken.sign(
      { data: newUser.id },
      process.env.ACTKN_SECRET_KEY,
      { expiresIn: "15m" }
    );

    const refresh_token = jsonwebtoken.sign(
      { data: newUser.id },
      process.env.REFRESHTKN_SECRET_KEY,
      { expiresIn: "24h" }
    );

    const userData = newUser.toJSON();
    delete userData.password;
    delete userData.salt;

    const wishlist = [];

    res.status(201).json({ access_token, refresh_token, userData, wishlist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
      where: { email },
      attributes: [
        "id",
        "email",
        "username",
        "password",
        "salt",
        "isBlocked",
        "isAdmin",
      ],
    });

    if (!user) {
      return res.status(400).json({ message: "User not exists" });
    }

    if (!user.validPassword(password)) {
      return res.status(400).json({ message: "Password incorrect" });
    }

    if (user.isBlocked) {
      return res
        .status(400)
        .json({ message: "Your account is currently blocked" });
    }

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.ACTKN_SECRET_KEY,
      {
        expiresIn: "2m",
      }
    );

    const refresh_token = jsonwebtoken.sign(
      { data: user.id },
      process.env.REFRESHTKN_SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    const userData = user.toJSON();
    delete userData.password;
    delete userData.salt;

    const userWishlist = await userModel.findByPk(user.id, {
      include: [
        {
          model: songModel,
          as: "WishlistedSongs",
          through: { attributes: [] },
        },
      ],
    });

    const wishlist = userWishlist.WishlistedSongs;

    res.status(200).json({ token, refresh_token, userData, wishlist });
  } catch (err) {
    console.log({ err });
    res.status(500).json({ message: "Opp sorry! some thing went wrong" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "User not founded" });
    }

    const newPassword = crypto.randomBytes(5).toString("hex");

    user.resetPassword(newPassword);
    await user.save();

    await sendEmail(email, "", newPassword);

    res.status(200).json({ message: "Reset password successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Opp sorry! some thing went wrong" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const userId = req.user.id;

    const user = await userModel.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(400).json({ message: "User not founded" });
    }

    if (!user.validPassword(password)) {
      return res.status(400).json({ message: "Password incorrect" });
    }

    user.resetPassword(newPassword);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  signup,
  verifyOtpAndSignup,
  signin,
  resetPassword,
  changePassword,
};
