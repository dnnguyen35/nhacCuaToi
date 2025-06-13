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
import { formatDuration } from "../../../utils/formatDuration";
import {
  setListSongs,
  setTotalSongs,
  setListArtists,
  setTotalArtists,
} from "../../../redux/slices/statsDataSlice";

const SongsTable = () => {
  const { listSongs, listArtists } = useSelector((state) => state.statsData);
  const [onRequest, setOnRequest] = useState(false);
  const [isUpdateSongDialogOpen, setIsUpdateSongDialogOpen] = useState(false);

  const dispatch = useDispatch();

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
              {listSongs.map((song) => (
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
                  <TableCell>{formatDuration(song.duration)}</TableCell>
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
      </CardContent>
    </Card>
  );
};

export default SongsTable;
