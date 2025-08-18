import express from "express";
import userRoute from "./user.route.js";
import songRoute from "./song.route.js";
import adminRoute from "./admin.route.js";
import playlistRoute from "./playlist.route.js";
import wishlistRoute from "./wishlist.route.js";
import authRoute from "./auth.route.js";
import paymentRoute from "./payment.route.js";

const router = express.Router();

router.use("/admins", adminRoute);

router.use("/users", userRoute);

router.use("/songs", songRoute);

router.use("/playlists", playlistRoute);

router.use("/wishlists", wishlistRoute);

router.use("/auth", authRoute);

router.use("/payments", paymentRoute);

export default router;
