import { body } from "express-validator";

export const validateCreatePlaylist = [
  body("playlistName").exists().withMessage("PlaylistName is required"),
];
