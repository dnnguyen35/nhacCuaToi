import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
  pool: true,
  maxConnections: 1,
  maxMessages: 10,
  tls: {
    rejectUnauthorized: false,
  },
});

export default transporter;
