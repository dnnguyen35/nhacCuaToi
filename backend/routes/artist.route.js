import express from "express";
import artistController from "../controllers/artist.controller.js";

const router = express.Router();

router.get("/all-artists", artistController.getAllArtists);

export default router;
