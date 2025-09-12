import { body } from "express-validator";

export const validateCreateAlbum = [
  body("title").exists().withMessage("Title is required"),
  body("artistId").exists().withMessage("ArtistId required"),
];

export const validateUpdateAlbum = [
  body("title").exists().withMessage("Title is required"),
  body("artistId").exists().withMessage("ArtistId required"),
];
