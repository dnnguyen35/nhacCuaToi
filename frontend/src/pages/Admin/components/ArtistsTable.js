import { Mic } from "@mui/icons-material";
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

const ArtistsTable = ({ listArtistsData }) => {
  const [artists, setArtists] = useState(listArtistsData);

  useEffect(() => {
    setArtists(listArtistsData);
  }, [listArtistsData]);

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <Mic sx={{ color: "green" }} fontSize="small" />
            <Typography variant="h6">Artists List</Typography>
          </Box>
        }
        subheader="Manage your artists"
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
                <TableCell sx={{ color: "primary.main" }}>Artist</TableCell>
                <TableCell sx={{ color: "primary.main" }}>
                  Total Songs
                </TableCell>
                <TableCell sx={{ color: "primary.main" }}>
                  Song in playlists
                </TableCell>
                <TableCell sx={{ color: "primary.main" }}>
                  Song in wishlists
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {artists.map((artist, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{artist.artist}</TableCell>
                  <TableCell>{artist.songCount}</TableCell>
                  <TableCell>{artist.playlistCount}</TableCell>
                  <TableCell>{artist.wishlistCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ArtistsTable;
