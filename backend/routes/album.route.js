import express from "express";
import albumController from "../controllers/album.controller.js";

const router = express.Router();

router.get("/all-albums", albumController.getAllAlbums);

router.get("/all-songs/:albumId", albumController.getAllSongsOfAlbum);

export default router;
