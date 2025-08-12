import express from "express";
import paymentController from "../controllers/payment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/all-payments",
  authMiddleware.auth,
  paymentController.getAllPaymentsOfUser
);

router.post(
  "/create-payment",
  authMiddleware.auth,
  paymentController.createPayment
);

router.post("/ipn", paymentController.handleIPN);

export default router;
