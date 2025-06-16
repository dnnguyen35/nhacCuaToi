import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AuthModal from "../components/AuthModal";
import PlaybackController from "../components/PlaybackController";
import { Outlet } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";
import BottomNavigate from "../components/BottomNavigate";

const MainLayout = () => {
  return (
    <>
      <AuthModal />

      <Box
        sx={{
          display: "flex",
          bgcolor: "background.default",
          color: "text.primary",
          height: "100vh",
          gap: 2,
        }}
      >
        <Sidebar />

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            maxHeight: { xs: "70vh", md: "81vh" },
            marginTop: { xs: 1, sm: 2 },
            marginRight: 2,
            marginLeft: { xs: 2, md: 0 },
            borderRadius: 3,
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          <Box sx={{ flexShrink: 1 }}>
            <Header />
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              padding: 2,
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": { width: 8, height: 8 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "primary.main",
                borderRadius: 5,
              },
            }}
          >
            <Outlet />
          </Box>
        </Box>

        <BottomNavigate />

        <PlaybackController />
      </Box>
    </>
  );
};

export default MainLayout;
