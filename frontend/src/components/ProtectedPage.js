import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthModalOpen } from "../redux/slices/authModalSlice";
import { Box, Typography } from "@mui/material";
import { setCurrentSong, setQueue } from "../redux/slices/playerSlice";
import { setAppState } from "../redux/slices/appStateSlice";
import { useTranslation } from "react-i18next";

const PleaseLogin = () => {
  const { t } = useTranslation();

  return (
    <Box position="relative" sx={{ marginTop: "7rem" }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
      >
        <img
          src="/ronaldo_siuuu.jpg"
          alt=""
          style={{ maxWidth: "100%", borderRadius: "50%", overflow: "hidden" }}
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
          textAlign={"center"}
        >
          {t("responseError.Please sign in to see this page")}
        </Typography>
      </Box>
    </Box>
  );
};

const ProtectedPage = ({ children }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  return user ? children : <PleaseLogin />;
};

export default ProtectedPage;
