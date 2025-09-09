import { body } from "express-validator";

export const validateCreateArtist = [
  body("artist").exists().withMessage("Artist is required"),
];

export const validateUpdateArtist = [
  body("artist").exists().withMessage("Artist is required"),
];
