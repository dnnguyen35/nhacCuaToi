import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { QueueMusic } from "@mui/icons-material";

const PlaylistsTable = ({ listPlaylistsData }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    setPlaylists(listPlaylistsData);
  }, [listPlaylistsData]);

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <QueueMusic sx={{ color: "green" }} fontSize="small" />
            <Typography variant="h6">Playlists</Typography>
          </Box>
        }
        subheader="Manage your playlists"
      />
      <CardContent>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: { xs: 300, md: 250 },
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
              height: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "primary.main",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "primary.main" }}>#</TableCell>
                <TableCell sx={{ color: "primary.main" }}>Playlist</TableCell>
                <TableCell sx={{ color: "primary.main" }}>Username</TableCell>
                <TableCell sx={{ color: "primary.main" }}>Created At</TableCell>
                <TableCell sx={{ color: "primary.main" }}>
                  Total songs
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playlists.map((playlist) => (
                <TableRow key={playlist.id}>
                  <TableCell>{playlist.id}</TableCell>
                  <TableCell>{playlist.name}</TableCell>
                  <TableCell>{playlist.username}</TableCell>
                  <TableCell>{playlist.createdAt.split("T")[0]}</TableCell>
                  <TableCell>{playlist.songCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default PlaylistsTable;
