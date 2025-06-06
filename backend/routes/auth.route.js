import authController from "../controllers/auth.controller.js";
import express from "express";

const router = express.Router();

router.post("/renew-accesstoken", authController.renewAccessToken);

export default router;
