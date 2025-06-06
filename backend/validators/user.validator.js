import { body } from "express-validator";

export const validateSignup = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
  body("username")
    .exists()
    .withMessage("Username is required")
    .isLength({ min: 5, max: 10 })
    .withMessage("Username must be between 5 and 10 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username must be letters, numbers, and underscores"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 1 })
    .withMessage("Password minimum is 1 characters"),
];

export const validateSignin = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 1 })
    .withMessage("Password minimum is 1 characters"),
];

export const validateResetPassword = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
];

export const validateChangePassword = [
  body("password").exists().withMessage("Password is required"),
  body("newPassword")
    .exists()
    .withMessage("New password required")
    .isLength({ min: 1 })
    .withMessage("New passsword minimun is 1 characters"),
];

export const validateOtp = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
  body("otp")
    .exists()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
];
