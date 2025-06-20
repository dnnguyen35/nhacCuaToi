import express from "express";
import authController from "../controllers/auth.controller.js";
import {
  validateSignin,
  validateSignup,
  validateResetPassword,
  validateOtp,
} from "../validators/user.validator.js";

import requestHandler from "../handlers/request.handler.js";

const router = express.Router();

router.post(
  "/signup",
  validateSignup,
  requestHandler.validate,
  authController.signup
);

router.post(
  "/verify-otp",
  validateOtp,
  requestHandler.validate,
  authController.verifyOtpAndSignup
);

router.post("/resend-otp", authController.resendOtp);

router.post(
  "/signin",
  validateSignin,
  requestHandler.validate,
  authController.signin
);

router.post(
  "/reset-password",
  validateResetPassword,
  requestHandler.validate,
  authController.resetPassword
);

router.post("/renew-accesstoken", authController.renewAccessToken);

export default router;
