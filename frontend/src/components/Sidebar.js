import React from "react";
import { Box } from "@mui/material";
import SidebarMenu from "./SidebarMenu";
import PlaylistList from "./PlaylistList";

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: "20%",
        minHeight: { xs: "70vh", md: "81vh" },
        maxHeight: { xs: "70vh", md: "81vh" },
        bgcolor: "background.default",
        marginTop: 2,
        marginLeft: 2,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        gap: 2,
        overflow: "hidden",
      }}
    >
      <SidebarMenu />
      <PlaylistList />
    </Box>
  );
};

export default Sidebar;
