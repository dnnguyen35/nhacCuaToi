import express from "express";
import wishlistController from "../controllers/wishlist.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/all-songs",
  authMiddleware.auth,
  wishlistController.getAllSongsOfWishlist
);

router.post(
  "/add-song/:songId",
  authMiddleware.auth,
  wishlistController.addSongToWishlist
);

router.delete(
  "/delete-song/:songId",
  authMiddleware.auth,
  wishlistController.deleteSongFromWishlist
);

router.post(
  "/delete-multiple-song",
  authMiddleware.auth,
  wishlistController.deleteMultipleSongFromWishlist
);

export default router;
