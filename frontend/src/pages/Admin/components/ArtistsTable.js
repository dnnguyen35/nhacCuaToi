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
  Pagination,
} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { rowOnEachPage } from "../../../configs/pagination.configs";

const ArtistsTable = () => {
  const { listArtists } = useSelector((state) => state.statsData);

  const rowPerPage = rowOnEachPage.artistTable;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayListArtists, setDisplayListArtists] = useState([]);

  useEffect(() => {
    const newTotalPages = Math.ceil(listArtists.length / rowPerPage) || 0;
    setTotalPages(newTotalPages);

    const startIndex = (currentPage - 1) * rowPerPage;

    const displayList =
      listArtists.slice(startIndex, startIndex + rowPerPage) || [];
    setDisplayListArtists(displayList);
  }, [currentPage, listArtists]);

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
            maxHeight: { xs: 300, md: 250, lg: 500 },
            overflow: "auto",
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
              {displayListArtists.map((artist, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {(currentPage - 1) * rowPerPage + index + 1}
                  </TableCell>
                  <TableCell>{artist.artist}</TableCell>
                  <TableCell>{artist.songCount}</TableCell>
                  <TableCell>{artist.playlistCount}</TableCell>
                  <TableCell>{artist.wishlistCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {listArtists.length > 0 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ArtistsTable;
