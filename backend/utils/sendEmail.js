import nodemailer from "nodemailer";

export const sendEmail = async (toEmail, type, content) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: toEmail,
      subject:
        type === "otp"
          ? "Verify your email for nhacCuaToi"
          : type === "payment"
            ? "Payment successfully"
            : "Reset password for nhacCuaToi acccount",
      html:
        type === "otp"
          ? `
        <h2>Hello friend,</h2>
        <p>Please verify your email by filling out with the code below:</p>
        <h3>Code: ${content}</h3>
        <p>This code will expire in 5 minutes.</p>
      `
          : type === "payment"
            ? `<h2>Hello friend,</h2>
        <p>Your payment for upgrade service</p>
        <h3>OrderId: ${content} - Total: 10.000(VND)</h3>
        <p>Thanks you</p>`
            : `<h2>Hello friend,</h2>
        <p>Your reset password request was done</p>
        <h3>Password: ${content}</h3>
        <p>Please change your password after sign in</p>`,
    };

    const result = await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};
