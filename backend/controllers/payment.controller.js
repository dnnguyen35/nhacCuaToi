import axios from "axios";
import paymentModel from "../models/payment.model.js";
import userModel from "../models/user.model.js";
import crypto, { createHmac } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../utils/sendEmail.js";
import { getIO, getUserSocketId } from "../configs/socket.js";
import redis from "../configs/redis.js";
import payos from "../configs/payos.js";

const getAllPaymentsOfUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const cachedAllPayments = await redis.get(`all-payments:${userId}`);

    if (cachedAllPayments) {
      return res.status(200).json(cachedAllPayments);
    }

    const allPayments = await paymentModel.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    if (!allPayments || allPayments.length === 0) {
      return res
        .status(200)
        .json({ message: "There is no payment", allPayments });
    }

    await redis.setex(
      `all-payments:${userId}`,
      300,
      JSON.stringify({ allPayments })
    );

    res.status(200).json({ allPayments });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const createPayment = async (req, res) => {
  try {
    const { amount, orderInfo } = req.body;
    const userId = req.user.id;

    const orderCode = parseInt(
      `${userId}${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`
    );
    const requestId = uuidv4();

    const paymentBody = {
      orderCode,
      amount,
      description: `${orderInfo} ${userId}`,
      returnUrl: process.env.REDIRECT_URL,
      cancelUrl: process.env.REDIRECT_URL,
    };

    const response = await payos.createPaymentLink(paymentBody);

    if (!response || !response.checkoutUrl) {
      return res.status(400).json({ message: "Service is not available now" });
    }

    const payUrl = response.checkoutUrl;

    const [newPayment] = await Promise.all([
      paymentModel.create({
        orderId: String(orderCode),
        accountNumber: "N/A",
        amount,
        orderInfo: `${orderInfo} ${userId}`,
        accountBankId: "N/A",
        userId,
        status: "pending",
      }),
      redis.del(`all-payments:${userId}`),
      redis.del("admin:payment-stats"),
    ]);

    if (getIO()) {
      getIO().to("admin-room").emit("newPayment", { newPayment });
    }

    res.status(201).json({ message: "Create payment successfully", payUrl });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleIPN = async (req, res) => {
  try {
    console.log("handling ipn");

    const { code, desc, data, signature, success } = req.body;

    console.log("IPN data:", data);

    if (!success) {
      return res.status(200).json({ message: "Test request ok" });
    }

    const sortedKeys = Object.keys(data).sort();
    console.log("Sorted keys:", sortedKeys);

    const alphabeticalData = sortedKeys
      .map((key) => `${key}=${data[key] ?? ""}`)
      .join("&");

    console.log("Alphabetical data:", alphabeticalData);

    const realSignature = crypto
      .createHmac("sha256", process.env.PAYOS_CHECKSUM_KEY)
      .update(alphabeticalData)
      .digest("hex");

    console.log("checksumKey:", process.env.PAYOS_CHECKSUM_KEY);

    if (realSignature !== signature) {
      console.error("Invalid signature:", realSignature, signature);
      return res.status(400).json({ message: "Invalid PAYOS signature" });
    }

    const userId = parseInt(data.description.split(" ")[2]);
    const orderId = String(data.orderCode);

    console.log("User ID:", userId);
    console.log("Order ID:", orderId);

    const payment = await paymentModel.findOne({
      where: { orderId, userId },
    });

    const user = await userModel.findByPk(userId);

    if (!payment || !user) {
      return res.status(400).json({ message: "Payment or user not found" });
    }

    if (payment.status === "completed") {
      return res.status(200).json({ message: "Payment already handled" });
    }

    if (code === "00" && desc === "success") {
      user.playlistLimit += 5;
      user.songLimit += 25;
    }

    setTimeout(() => {
      const userSocketId = getUserSocketId(userId);

      if (userSocketId) {
        getIO().to(userSocketId).emit("payment_success", {
          orderId,
          amount: data.amount,
          resultCode: code,
        });
        console.log("payment notify sended");
      }
    }, 10000);

    payment.resultCode = parseInt(code);
    payment.message = desc;
    payment.status = code === "00" ? "completed" : "uncompleted";
    payment.orderInfo = data.description;
    payment.accountNumber = data.counterAccountNumber || "N/A";
    payment.accountBankId = data.counterAccountBankId || "N/A";

    await Promise.all([
      user.save(),
      payment.save(),
      sendEmail(user.email, "payment", orderId),
      redis.del("admin:payment-stats"),
    ]);

    if (getIO()) {
      getIO().to("admin-room").emit("updatePayment", { payment });
    }

    console.log("handled ipn");
    res.status(204).json({ message: "Handle IPN successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getAllPaymentsOfUser,
  createPayment,
  handleIPN,
};
