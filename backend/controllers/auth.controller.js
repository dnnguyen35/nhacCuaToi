import userModel from "../models/user.model.js";
import songModel from "../models/song.model.js";
import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import redis from "../configs/redis.js";
import { verifyEmailExists } from "../utils/verifyEmailExists.js";

const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const isEmailExist = await userModel.findOne({ where: { email } });
    if (isEmailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (!(await verifyEmailExists(email))) {
      return res.status(400).json({ message: "Email doesn't exist" });
    }

    if (await redis.get(`signup-info:${email}`)) {
      const newSignupInfo = JSON.stringify({ username, password });

      const currentOtpRemaining = await redis.ttl(`signup-otp:${email}`);

      let otpExpireAt = 0;

      if (currentOtpRemaining) {
        otpExpireAt = Math.floor(Date.now() / 1000) + currentOtpRemaining;
      }

      await redis.setex(`signup-info:${email}`, 900, newSignupInfo);
      return res
        .status(200)
        .json({ message: "OTP has beeen send to email", otpExpireAt });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const signupInfo = JSON.stringify({ username, password });

    const otpExpireAt = Math.floor(Date.now() / 1000) + 120;

    console.log("email sending");

    await Promise.all([
      redis.setex(`signup-otp:${email}`, 120, otp.toString()),
      redis.setex(`signup-info:${email}`, 900, signupInfo),
      sendEmail(email, "otp", otp),
    ]);

    console.log("email send");

    res
      .status(200)
      .json({ message: "OTP has beeen send to email", otpExpireAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOtpAndSignup = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log("email: ", email);

    console.log("otp: ", typeof otp);

    const signupOtp = await redis.get(`signup-otp:${email}`);
    console.log("signupOtp: ", typeof signupOtp);

    const signupInfo = await redis.get(`signup-info:${email}`);

    if (!signupInfo) {
      if (signupOtp) {
        await redis.del(`signup-otp:${email}`);
      }
      return res
        .status(400)
        .json({ message: "Session expired! Please sign up again" });
    }

    if (!signupOtp) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (signupOtp.toString() !== otp) {
      return res.status(400).json({ message: "OTP not match" });
    }

    const { username, password } = signupInfo;

    const newUser = userModel.build({ email, username });

    newUser.setPassword(password);

    await newUser.save();

    await Promise.all([
      redis.del(`signup-info:${email}`),
      redis.del(`signup-otp:${email}`),
    ]);

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

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const signupInfo = await redis.get(`signup-info:${email}`);

    if (!signupInfo) {
      return res
        .status(400)
        .json({ message: "Session expired! Please sign up again" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpireAt = Math.floor(Date.now() / 1000) + 120;

    await Promise.all([
      redis.setex(`signup-otp:${email}`, 120, otp.toString()),
      sendEmail(email, "otp", otp),
    ]);

    res
      .status(200)
      .json({ message: "OTP has beeen send to email", otpExpireAt });
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
        expiresIn: "15m",
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

    await sendEmail(email, "resetPassword", newPassword);

    res.status(200).json({ message: "Reset password successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Opp sorry! some thing went wrong" });
  }
};

const renewAccessToken = (req, res) => {
  try {
    const { refreshToken } = req.body;

    const userData = jsonwebtoken.verify(
      refreshToken,
      process.env.REFRESHTKN_SECRET_KEY
    );

    const newAccessToken = jsonwebtoken.sign(
      { data: userData.data },
      process.env.ACTKN_SECRET_KEY,
      { expiresIn: "2m" }
    );

    res.status(200).json({ newAccessToken });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Refresh token exprired" });
  }
};

export default {
  signup,
  verifyOtpAndSignup,
  resendOtp,
  signin,
  resetPassword,
  renewAccessToken,
};
