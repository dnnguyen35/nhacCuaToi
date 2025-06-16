import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" style={{ textDecoration: "none" }}>
      <Typography
        fontWeight="700"
        fontSize="1.7rem"
        sx={{
          background: "linear-gradient(90deg, #4ADE80, #14B8A6, #3B82F6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          display: "inline-block",
        }}
      >
        nhacCuaToi
      </Typography>
    </Link>
  );
};

export default Logo;
