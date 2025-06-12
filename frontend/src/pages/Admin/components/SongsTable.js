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
import { useState, useEffect } from "react";
import adminApi from "../../../api/modules/admin.api";
import { toast } from "react-toastify";
import AddSongDialog from "./AddSongDialog";
import Swal from "sweetalert2";
import UpdateSongDialog from "./UpdateSongDialog";
import { useSelector } from "react-redux";
import { formatDuration } from "../../../utils/formatDuration";

const SongsTable = ({ listSongsData, onTotalSongsChange }) => {
  const [songs, setSongs] = useState([]);
  const [onRequest, setOnRequest] = useState(false);
  const [isUpdateSongDialogOpen, setIsUpdateSongDialogOpen] = useState(false);

  const { themeMode } = useSelector((state) => state.themeMode);

  const [updateSong, setUpdateSong] = useState(null);

  useEffect(() => {
    setSongs(listSongsData);
  }, [listSongsData]);

  const updateSongsList = (newSongsList) => setSongs(newSongsList);

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
      const newSongs = songs.filter((s) => s.id !== song.id);
      setSongs([...newSongs]);
      onTotalSongsChange(newSongs.length);
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
        action={
          <AddSongDialog
            songsData={songs}
            updateSongsList={updateSongsList}
            onTotalSongsChange={onTotalSongsChange}
          />
        }
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
              {songs.map((song) => (
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
            songsData={songs}
            song={updateSong}
            isUpdateSongDialogOpen={isUpdateSongDialogOpen}
            setIsUpdateSongDialogOpen={setIsUpdateSongDialogOpen}
            updateSongsList={updateSongsList}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SongsTable;
