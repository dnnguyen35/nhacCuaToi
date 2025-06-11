import axios from "axios";

export const verifyEmailExists = async (email) => {
  try {
    const res = await axios.get("http://apilayer.net/api/check", {
      params: {
        access_key: process.env.MAILBOXLAYER_API_KEY,
        email,
        smtp: 1,
        format: 1,
      },
    });

    return res.data.format_valid && res.data.smtp_check;
  } catch (error) {
    console.error("Email verification error:", error.message);
    return false;
  }
};
