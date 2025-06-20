import express from "express";
import userController from "../controllers/user.controller.js";
import { validateChangePassword } from "../validators/user.validator.js";

import requestHandler from "../handlers/request.handler.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/info", authMiddleware.auth, userController.getInfo);

router.put(
  "/change-password",
  authMiddleware.auth,
  validateChangePassword,
  requestHandler.validate,
  userController.changePassword
);

export default router;
