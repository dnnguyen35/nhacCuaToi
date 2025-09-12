import express from "express";
import albumController from "../controllers/album.controller.js";

const router = express.Router();

router.get("/all-albums", albumController.getAllAlbums);

export default router;
