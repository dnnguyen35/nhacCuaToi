import { Album, Edit, PlaylistAdd } from "@mui/icons-material";
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
  Avatar,
  IconButton,
} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { rowOnEachPage } from "../../../configs/pagination.configs";
import AddAlbumDialog from "./AddAlbumDialog";
import UpdateAlbumDialog from "./UpdateAlbumDialog";
import AddSongIntoAlbumDialog from "./AddSongIntoAlbumDialog";

const AlbumsTable = () => {
  const { listAlbums } = useSelector((state) => state.statsData);

  const rowPerPage = rowOnEachPage.wishlistTable;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayListAlbums, setDisplayListAlbums] = useState([]);

  const [updateAlbum, setUpdateAlbum] = useState(null);
  const [isUpdateAlbumDialogOpen, setIsUpdateAlbumDialogOpen] = useState(false);

  const [addSongAlbum, setAddSongAlbum] = useState(null);
  const [isAddSongIntoAlbumDialogOpen, setIsAddSongIntoAlbumDialogOpen] =
    useState(false);

  const onUpdateAlbumClick = (openUpdateAlbumDialogStatus, album) => {
    setUpdateAlbum(album);

    setIsUpdateAlbumDialogOpen(openUpdateAlbumDialogStatus);
  };

  const onAddSongIntoAlbumClick = (openAddSongIntoAlbumDialogStatus, album) => {
    setAddSongAlbum(album);

    setIsAddSongIntoAlbumDialogOpen(openAddSongIntoAlbumDialogStatus);
  };

  useEffect(() => {
    const newTotalPages = Math.ceil(listAlbums.length / rowPerPage) || 0;
    setTotalPages(newTotalPages);

    const startIndex = (currentPage - 1) * rowPerPage;

    const displayList =
      listAlbums.slice(startIndex, startIndex + rowPerPage) || [];
    setDisplayListAlbums(displayList);
  }, [currentPage, listAlbums]);

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <Album sx={{ color: "green" }} fontSize="small" />
            <Typography variant="h6">Albums List</Typography>
          </Box>
        }
        subheader="Manage your albums"
        action={<AddAlbumDialog />}
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
                <TableCell sx={{ color: "primary.main" }}>Image</TableCell>
                <TableCell sx={{ color: "primary.main" }}>Title</TableCell>
                <TableCell sx={{ color: "primary.main" }}>Artist</TableCell>
                <TableCell sx={{ color: "primary.main" }}>Songs</TableCell>
                <TableCell sx={{ color: "primary.main" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayListAlbums.map((album, index) => (
                <TableRow key={album.id}>
                  <TableCell>
                    {(currentPage - 1) * rowPerPage + index + 1}
                  </TableCell>
                  <TableCell>
                    <Avatar
                      src={album.imageUrl}
                      alt={album.title}
                      variant="rounded"
                    />
                  </TableCell>
                  <TableCell>{album.title}</TableCell>
                  <TableCell>{album.artist}</TableCell>
                  <TableCell>{album.songCount}</TableCell>
                  <TableCell>
                    <Box display={"flex"} gap={1}>
                      <IconButton
                        onClick={() => onUpdateAlbumClick(true, album)}
                        color="success"
                      >
                        <Edit />
                      </IconButton>

                      <IconButton
                        onClick={() => onAddSongIntoAlbumClick(true, album)}
                        color="success"
                      >
                        <PlaylistAdd />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {updateAlbum !== null && (
          <UpdateAlbumDialog
            album={updateAlbum}
            isUpdateAlbumDialogOpen={isUpdateAlbumDialogOpen}
            setIsUpdateAlbumDialogOpen={setIsUpdateAlbumDialogOpen}
            setAlbum={setUpdateAlbum}
          />
        )}

        {addSongAlbum !== null && (
          <AddSongIntoAlbumDialog
            album={addSongAlbum}
            isAddSongIntoAlbumDialogOpen={isAddSongIntoAlbumDialogOpen}
            setIsAddSongIntoAlbumDialogOpen={setIsAddSongIntoAlbumDialogOpen}
            setAlbum={setAddSongAlbum}
          />
        )}

        {listAlbums.length > 0 && (
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

export default AlbumsTable;
