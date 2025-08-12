import userModel from "../models/user.model.js";

const getInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(400).json({ message: "User not founded" });
    }

    const userInfo = user.toJSON();
    delete userInfo.password;
    delete userInfo.salt;

    res.status(200).json(userInfo);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getInfo,
  changePassword,
};
