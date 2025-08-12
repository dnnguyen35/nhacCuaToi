import express from "express";
import playlistController from "../controllers/playlist.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateCreatePlaylist } from "../validators/playlist.validator.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware.auth,
  validateCreatePlaylist,
  requestHandler.validate,
  playlistController.createPlaylist
);

router.post(
  "/add-song/:playlistId/:songId",
  authMiddleware.auth,
  playlistController.addSongToPlaylist
);

router.get(
  "/all-playlists",
  authMiddleware.auth,
  playlistController.getAllPlaylistsOfUser
);

router.get(
  "/all-songs/:playlistId",
  authMiddleware.auth,
  playlistController.getAllSongsOfPlaylist
);

router.delete(
  "/delete/:playlistId",
  authMiddleware.auth,
  playlistController.deletePlaylist
);

router.delete(
  "/delete-song/:playlistId/:songId",
  authMiddleware.auth,
  playlistController.deleteSongFromPlaylist
);

router.post(
  "/delete-multiple-song",
  authMiddleware.auth,
  playlistController.deleteMultipleSongFromPlaylist
);

export default router;
