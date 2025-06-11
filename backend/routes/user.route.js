import express from "express";
import userController from "../controllers/user.controller.js";
import {
  validateSignin,
  validateSignup,
  validateResetPassword,
  validateChangePassword,
  validateOtp,
} from "../validators/user.validator.js";

import requestHandler from "../handlers/request.handler.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/signup",
  validateSignup,
  requestHandler.validate,
  userController.signup
);

router.post(
  "/verify-otp",
  validateOtp,
  requestHandler.validate,
  userController.verifyOtpAndSignup
);

router.post("/resend-otp", userController.resendOtp);

router.post(
  "/signin",
  validateSignin,
  requestHandler.validate,
  userController.signin
);

router.post(
  "/reset-password",
  validateResetPassword,
  requestHandler.validate,
  userController.resetPassword
);

router.put(
  "/change-password",
  authMiddleware.auth,
  validateChangePassword,
  requestHandler.validate,
  userController.changePassword
);

export default router;
