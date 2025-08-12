import express from "express";
import adminController from "../controllers/admin.controller.js";
import requestHandler from "../handlers/request.handler.js";
import {
  validateCreateSong,
  validateUpdateSong,
} from "../validators/song.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/user-stats",
  authMiddleware.auth,
  authMiddleware.checkAdmin,
  adminController.getUserStats
);

router.put(
  "/block-user/:userId",
  authMiddleware.auth,
  authMiddleware.checkAdmin,
  adminController.blockUser
);

router.put(
  "/unblock-user/:userId",
  authMiddleware.auth,
  authMiddleware.checkAdmin,
  adminController.unBlockUser
);

router.get(
  "/song-stats",
  authMiddleware.auth,
  authMiddleware.checkAdmin,
  adminController.getSongStats
);

router.post(
  "/create-song",
  authMiddleware.auth,
  authMiddleware.checkAdmin,
  validateCreateSong,
  requestHandler.validate,
  adminController.createSong
);

router.put(
  "/update-song/:songId",
  authMiddleware.auth,
  authMiddleware.checkAdmin,
  validateUpdateSong,
  requestHandler.validate,
  adminController.updateSong
);

router.delete(
  "/delete-song/:songId",
  authMiddleware.auth,
  authMiddleware.checkAdmin,
  adminController.deleteSong
);

router.get(
  "/playlist-stats",
  authMiddleware.auth,
  authMiddleware.checkAdmin,
  adminController.getPlaylistStats
);

router.get(
  "/artist-stats",
  authMiddleware.auth,
  authMiddleware.checkAdmin,
  adminController.getArtistStats
);

router.get(
  "/payment-stats",
  authMiddleware.auth,
  authMiddleware.checkAdmin,
  adminController.getPaymentStats
);

export default router;
