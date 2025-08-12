import { Server } from "socket.io";
import jsonwebtoken from "jsonwebtoken";
import userModel from "../models/user.model.js";

let io;
const userSockets = new Map();

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      const tokenDecoded = jsonwebtoken.verify(
        token,
        process.env.ACTKN_SECRET_KEY
      );

      if (!tokenDecoded) {
        throw new Error("Invalid token");
      }

      const userId = tokenDecoded.data;

      const user = await userModel.findOne({ where: { id: userId } });

      if (!user) {
        throw new Error("User not founded");
      }

      socket.userId = userId;
      socket.isAdmin = user.isAdmin;
      next();
    } catch (error) {
      next(error);
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;
    const isAdmin = socket.isAdmin;

    userSockets.set(userId, socket.id);
    console.log("userSockets: ", userSockets);

    if (isAdmin) {
      socket.join("admin-room");
    }

    io.to("admin-room").emit("user_online", {
      userOnline: Array.from(userSockets.keys()),
    });

    console.log("userSockets: ", Array.from(userSockets.keys()));

    socket.on("disconnect", () => {
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          io.to("admin-room").emit("user_online", {
            userOnline: Array.from(userSockets.keys()),
          });
          console.log("userSockets: ", Array.from(userSockets.keys()));
          console.log("userSockets: ", userSockets);
          break;
        }
      }
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

export const getUserSocketId = (userId) => {
  return userSockets.get(userId);
};
