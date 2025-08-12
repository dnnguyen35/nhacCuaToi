import axios from "axios";

export const verifyEmailExists = async (email) => {
  try {
    const res = await axios.get("http://apilayer.net/api/check", {
      params: {
        access_key: process.env.MAILBOXLAYER_API_KEY,
        email,
        smtp: 0,
        format: 1,
      },
    });

    // return res.data.format_valid && res.data.smtp_check;
    return res.data.format_valid && res.data.mx_found;
  } catch (error) {
    return false;
  }
};
