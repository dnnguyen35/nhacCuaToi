import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  Pagination,
} from "@mui/material";
import {
  DeleteForever,
  LibraryMusic,
  Edit,
  AccessTime,
} from "@mui/icons-material";
import { useState } from "react";
import adminApi from "../../../api/modules/admin.api";
import { toast } from "react-toastify";
import AddSongDialog from "./AddSongDialog";
import Swal from "sweetalert2";
import UpdateSongDialog from "./UpdateSongDialog";
import { useSelector, useDispatch } from "react-redux";
import {
  setListSongs,
  setTotalSongs,
  setListArtists,
  setTotalArtists,
} from "../../../redux/slices/statsDataSlice";
import { formatDurationToHMS } from "../../../utils/formatDurationToHMS";
import { useEffect } from "react";
import { rowOnEachPage } from "../../../configs/pagination.configs";

const SongsTable = () => {
  const { listSongs, listArtists } = useSelector((state) => state.statsData);
  const [onRequest, setOnRequest] = useState(false);
  const [isUpdateSongDialogOpen, setIsUpdateSongDialogOpen] = useState(false);

  const dispatch = useDispatch();

  const rowPerPage = rowOnEachPage.wishlistTable;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayListSongs, setDisplayListSongs] = useState([]);

  const { themeMode } = useSelector((state) => state.themeMode);

  const [updateSong, setUpdateSong] = useState(null);

  const onUpdateSongClick = (openUpdateDialogStatus, song) => {
    setUpdateSong(song);

    setIsUpdateSongDialogOpen(openUpdateDialogStatus);
  };

  const onDeleteSongClick = async (song) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete "${song.title}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      theme: themeMode,
    });

    if (!confirm.isConfirmed) return;

    if (onRequest) return;

    setOnRequest(true);
    const { response, error } = await adminApi.deleteSong({ songId: song.id });
    setOnRequest(false);

    if (error) toast.error(error.message);

    if (response) {
      toast.success("Song deleted successfully");
      const newListSongs = listSongs.filter((s) => s.id !== song.id);
      dispatch(setListSongs(newListSongs));
      dispatch(setTotalSongs(newListSongs.length));

      const newListArtists = listArtists
        .map((artist) =>
          artist.artist === song.artist
            ? { ...artist, songCount: artist.songCount - 1 }
            : artist
        )
        .filter((artist) => artist.songCount > 0);

      dispatch(setListArtists(newListArtists));
      dispatch(setTotalArtists(newListArtists.length));
    }
  };

  useEffect(() => {
    const newTotalPages = Math.ceil(listSongs.length / rowPerPage) || 0;
    setTotalPages(newTotalPages);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }

    const startIndex = (currentPage - 1) * rowPerPage;

    const displayList =
      listSongs.slice(startIndex, startIndex + rowPerPage) || [];
    setDisplayListSongs(displayList);
  }, [currentPage, listSongs]);

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <LibraryMusic sx={{ color: "green" }} fontSize="small" />
            <Typography variant="h6">Songs Library</Typography>
          </Box>
        }
        subheader="Manage your music tracks"
        action={<AddSongDialog />}
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
                <TableCell sx={{ color: "primary.main" }}>
                  <AccessTime />
                </TableCell>
                <TableCell
                  sx={{ color: "primary.main", width: 120, minWidth: 100 }}
                >
                  Created At
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                  In playlists
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                  In wishlists
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayListSongs.map((song) => (
                <TableRow key={song.id}>
                  <TableCell>{song.id}</TableCell>
                  <TableCell>
                    <Avatar
                      src={song.imageUrl}
                      alt={song.title}
                      variant="rounded"
                    />
                  </TableCell>
                  <TableCell>{song.title}</TableCell>
                  <TableCell>{song.artist}</TableCell>
                  <TableCell>{formatDurationToHMS(song.duration)}</TableCell>
                  <TableCell>{song.createdAt.split("T")[0]}</TableCell>
                  <TableCell>{song.playlistCount}</TableCell>
                  <TableCell>{song.wishlistCount}</TableCell>
                  <TableCell>
                    <Box display={"flex"} gap={1}>
                      <IconButton
                        onClick={() => onUpdateSongClick(true, song)}
                        color="success"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => onDeleteSongClick(song)}
                        color={"error"}
                      >
                        <DeleteForever />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {updateSong !== null && (
          <UpdateSongDialog
            song={updateSong}
            isUpdateSongDialogOpen={isUpdateSongDialogOpen}
            setIsUpdateSongDialogOpen={setIsUpdateSongDialogOpen}
          />
        )}

        {listSongs.length > 0 && (
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

export default SongsTable;
