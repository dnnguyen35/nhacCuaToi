import jsonwebtoken from "jsonwebtoken";

const renewAccessToken = (req, res) => {
  try {
    const { refreshToken } = req.body;

    const userData = jsonwebtoken.verify(
      refreshToken,
      process.env.REFRESHTKN_SECRET_KEY
    );

    const newAccessToken = jsonwebtoken.sign(
      { data: userData.data },
      process.env.ACTKN_SECRET_KEY,
      { expiresIn: "2m" }
    );

    res.status(200).json({ newAccessToken });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Refresh token exprired" });
  }
};

export default {
  renewAccessToken,
};
