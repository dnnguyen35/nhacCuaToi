import axios from "axios";
import paymentModel from "../models/payment.model.js";
import userModel from "../models/user.model.js";
import crypto, { createHmac } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../utils/sendEmail.js";
import { getIO, getUserSocketId } from "../configs/socket.js";
import redis from "../configs/redis.js";

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

    const orderId = uuidv4();
    const requestId = uuidv4();

    const rawSignature =
      `accessKey=${process.env.MOMO_ACCESS_KEY}` +
      `&amount=${amount}` +
      `&extraData=${userId}` +
      `&ipnUrl=${process.env.IPN_URL}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${process.env.MOMO_PARTNER_CODE}` +
      `&redirectUrl=${process.env.REDIRECT_URL}` +
      `&requestId=${requestId}` +
      `&requestType=payWithATM`;

    const signature = crypto
      .createHmac("sha256", process.env.MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest("hex");

    const paymentBody = {
      partnerCode: process.env.MOMO_PARTNER_CODE,
      accessKey: process.env.MOMO_ACCESS_KEY,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: process.env.REDIRECT_URL,
      ipnUrl: process.env.IPN_URL,
      extraData: `${userId}`,
      requestType: "payWithATM",
      signature,
      lang: "vi",
    };

    const response = await axios.post(
      process.env.MOMO_CREATE_PAYMENT_URL,
      paymentBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (
      !response.data ||
      response.data.resultCode !== 0 ||
      !response.data.payUrl
    ) {
      return res.status(400).json({ message: "Service is not available now" });
    }

    const payUrl = response.data.payUrl;

    const [newPayment] = await Promise.all([
      paymentModel.create({
        orderId,
        requestId,
        amount,
        orderInfo,
        payUrl,
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
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleIPN = async (req, res) => {
  try {
    console.log("handling ipn");
    const {
      partnerCode,
      accessKey,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = req.body;

    const rawSignature =
      `accessKey=${process.env.MOMO_ACCESS_KEY}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&message=${message}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&orderType=${orderType}` +
      `&partnerCode=${partnerCode}` +
      `&payType=${payType}` +
      `&requestId=${requestId}` +
      `&responseTime=${responseTime}` +
      `&resultCode=${resultCode}` +
      `&transId=${transId}`;

    const realSignature = crypto
      .createHmac("sha256", process.env.MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest("hex");

    if (realSignature !== signature) {
      return res.status(400).json({ message: "Invalid MoMo signature" });
    }

    const userId = Number(extraData);

    const payment = await paymentModel.findOne({
      where: { orderId, requestId, userId },
    });

    const user = await userModel.findByPk(userId);

    if (!payment || !user) {
      return res.status(400).json({ message: "Payment or user not found" });
    }

    if (payment.status === "completed") {
      return res.status(200).json({ message: "Payment already handled" });
    }

    if (resultCode === 0 && message === "Successful.") {
      user.playlistLimit += 5;
      user.songLimit += 25;
    }

    setTimeout(() => {
      const userSocketId = getUserSocketId(userId);

      if (userSocketId) {
        getIO()
          .to(userSocketId)
          .emit("payment_success", { orderId, amount, resultCode });
        console.log("payment notify sended");
      }
    }, 10000);

    payment.resultCode = resultCode;
    payment.message = message;
    payment.status = resultCode === 0 ? "completed" : "uncompleted";

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
