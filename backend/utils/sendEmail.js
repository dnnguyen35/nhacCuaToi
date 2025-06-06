import nodemailer from "nodemailer";

export const sendEmail = async (toEmail, username = "", content) => {
  console.log(process.env.GMAIL_USER);
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
      subject: "Verify your email for nhacCuaToi",
      html: `
        <h2>Hello ${username},</h2>
        <p>Please verify your email by filling out with the code below:</p>
        <h3>Code: ${content}</h3>
        <p>This code will expire in 5 minutes.</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Send email: ", result.response);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
