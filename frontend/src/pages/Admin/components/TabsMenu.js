import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import MicIcon from "@mui/icons-material/Mic";

import UsersTable from "./UsersTable";
import SongsTable from "./SongsTable";
import PlaylistsTable from "./PlaylistsTable";
import ArtistsTable from "./ArtistsTable";

const TabsMenu = () => {
  const [value, setValue] = useState(0);

  const tabsIcon = [
    { icon: <PeopleIcon />, label: "Users" },
    { icon: <LibraryMusicIcon />, label: "Songs" },
    { icon: <QueueMusicIcon />, label: "Playlists" },
    { icon: <MicIcon />, label: "Artists" },
  ];

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "90%",
        bgcolor: "background.default",
        borderRadius: 2,
        mx: "auto",
        mt: "2rem",
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        sx={{
          bgcolor: "grey.900",
          borderRadius: 2,
          "& .MuiTabs-indicator": { display: "none" },
        }}
      >
        {tabsIcon.map((tab, index) => (
          <Tab
            key={index}
            icon={tab.icon}
            label={tab.label}
            sx={{
              color: "white",
              "&.Mui-selected": {
                bgcolor: "grey.800",
                borderRadius: 1,
              },
            }}
          />
        ))}
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {value === 0 && <UsersTable />}
        {value === 1 && <SongsTable />}
        {value === 2 && <PlaylistsTable />}
        {value === 3 && <ArtistsTable />}
      </Box>
    </Box>
  );
};

export default TabsMenu;
