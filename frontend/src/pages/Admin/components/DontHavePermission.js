import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DontHavePermission = () => {
  const navigate = useNavigate();

  return (
    <Box position="relative" sx={{ marginTop: "7rem" }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="50vh"
      >
        <img
          src="/ronaldo_siu_siu.png"
          alt=""
          width="150"
          style={{ maxWidth: "100%" }}
        />
        <Typography
          mt={2}
          fontSize={{ xs: "1.5rem", md: "1.7rem" }}
          fontWeight={700}
          sx={{
            background: "linear-gradient(90deg, #4ADE80, #14B8A6, #3B82F6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
          }}
        >
          You don't have admin permission !
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3, px: 4, fontSize: "1rem", textTransform: "none" }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default DontHavePermission;
