import express from "express";
import songController from "../controllers/song.controller.js";

const router = express.Router();

router.get("/all-songs", songController.getAllSongs);

router.get("/trending-songs", songController.getTrendingSongs);

router.get("/search", songController.searchSong);

export default router;
