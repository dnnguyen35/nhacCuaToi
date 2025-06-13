import { Grid, Box } from "@mui/material";
import StatCard from "./StatCard";
import PeopleIcon from "@mui/icons-material/People";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import MicIcon from "@mui/icons-material/Mic";
import { useSelector } from "react-redux";

const StatDashboard = () => {
  const { totalUsers, totalSongs, totalPlaylists, totalArtists } = useSelector(
    (state) => state.statsData
  );
  const statsData = [
    {
      icon: <PeopleIcon fontSize="large" color="primary" />,
      label: "Total Users",
      value: totalUsers ?? 0,
    },
    {
      icon: <LibraryMusicIcon fontSize="large" color="secondary" />,
      label: "Total Songs",
      value: totalSongs ?? 0,
    },
    {
      icon: <QueueMusicIcon fontSize="large" color="error" />,
      label: "Total Playlists",
      value: totalPlaylists ?? 0,
    },
    {
      icon: <MicIcon fontSize="large" sx={{ color: "#6a1b9a" }} />,
      label: "Total Artists",
      value: totalArtists ?? 0,
    },
  ];

  return (
    <Box
      sx={{
        width: "90%",
        mx: "auto",
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard icon={stat.icon} label={stat.label} value={stat.value} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StatDashboard;
