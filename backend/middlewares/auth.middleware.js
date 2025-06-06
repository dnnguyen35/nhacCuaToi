import jsonwebtoken from "jsonwebtoken";
import userModel from "../models/user.model.js";

const tokenDecode = (req) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];

      return jsonwebtoken.verify(token, process.env.ACTKN_SECRET_KEY);
    }

    return false;
  } catch (err) {
    console.log({ err });
    return false;
  }
};

const auth = async (req, res, next) => {
  try {
    const tokenDecoded = tokenDecode(req);

    if (!tokenDecoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = tokenDecoded.data;

    const user = await userModel.findOne({
      where: { id: userId },
      attributes: ["id", "username", "email", "isAdmin", "isBlocked"],
    });

    if (!user) {
      return res.status(400).json({ message: "User not exists" });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log("Error is: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Unauthorized! Admin only" });
  }

  next();
};

export default {
  auth,
  checkAdmin,
};
