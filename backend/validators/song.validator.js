import { body } from "express-validator";

export const validateCreateSong = [
  body("title").exists().withMessage("Title is required"),
  body("artist").exists().withMessage("Artist is required"),
  body("duration").exists().withMessage("Duration is required"),
];

export const validateUpdateSong = [
  body("title").exists().withMessage("Title is required"),
  body("artist").exists().withMessage("Artist is required"),
];
