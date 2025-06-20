import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PageNotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          src="/ronaldo_siuuu.jpg"
          alt=""
          width="150"
          style={{ maxWidth: "100%", borderRadius: "50%" }}
        />
        <Typography
          mt={2}
          fontSize={{ xs: "1.rem", sm: "1.5rem" }}
          fontWeight={700}
          sx={{
            background: "linear-gradient(90deg, #4ADE80, #14B8A6, #3B82F6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
          }}
        >
          {t("pageNotFound")}
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3, px: 4, fontSize: "1rem", textTransform: "none" }}
          onClick={() => navigate("/")}
        >
          {t("backToHome")}
        </Button>
      </Box>
    </Box>
  );
};

export default PageNotFound;
