import React from "react";
import { Box } from "@mui/material";
import SidebarMenu from "./SidebarMenu";
import PlaylistList from "./PlaylistList";

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: "20%",
        bgcolor: "background.default",
        marginTop: 2,
        marginLeft: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <SidebarMenu />
      <PlaylistList />
    </Box>
  );
};

export default Sidebar;
