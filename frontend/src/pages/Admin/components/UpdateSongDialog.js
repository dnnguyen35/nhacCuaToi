import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import adminApi from "../../../api/modules/admin.api";
import { useSelector, useDispatch } from "react-redux";
import {
  setListSongs,
  setListArtists,
  setTotalArtists,
} from "../../../redux/slices/statsDataSlice";

const UpdateSongDialog = ({
  song,
  isUpdateSongDialogOpen,
  setIsUpdateSongDialogOpen,
}) => {
  const { listSongs, listArtists } = useSelector((state) => state.statsData);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  console.log("updateSong: ", song);

  const [updateSong, setUpdateSong] = useState({
    title: song.title,
    artist: song.artist,
    newArtist: "",
  });

  useEffect(() => {
    setUpdateSong({ title: song.title, artist: song.artist, newArtist: "" });
  }, [song]);

  const handleSubmit = async () => {
    if (!updateSong.title || updateSong.title === "") {
      return toast.error("Please fill out song title");
    }

    if (updateSong.artist === "") {
      return toast.error("Please choose artist");
    }

    if ((updateSong.artist === "otherArtist") & (updateSong.newArtist === "")) {
      return toast.error("Please choose artist");
    }

    const artistName =
      updateSong.artist !== "" && updateSong.artist !== "otherArtist"
        ? updateSong.artist
        : updateSong.newArtist;

    setIsLoading(true);

    const { response, error } = await adminApi.updateSong({
      songId: song.id,
      title: updateSong.title,
      artist: artistName,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    }

    if (response) {
      if (updateSong.newArtist && updateSong.newArtist !== "") {
        const newListArtists = [
          ...listArtists,
          {
            artist: updateSong.newArtist,
            songCount: 1,
            playlistCount: 0,
            wishlistCount: 0,
          },
        ];

        dispatch(setListArtists(newListArtists));
        dispatch(setTotalArtists(newListArtists.length));
      } else {
        const newListArtists = listArtists.map((artist) =>
          artist.artist === updateSong.artist
            ? { ...artist, songCount: artist.songCount + 1 }
            : artist
        );

        dispatch(setListArtists(newListArtists));
        dispatch(setTotalArtists(newListArtists.length));
      }

      setIsUpdateSongDialogOpen(false);
      toast.success("Song updated succeefully");
      console.log("affter update song: ", response);
      const newListSongs = listSongs.map((prevSong) =>
        prevSong.id === response.song.id
          ? {
              ...prevSong,
              title: response.song.title,
              artist: response.song.artist,
            }
          : prevSong
      );
      console.log("list song after edit song: ", newListSongs);
      dispatch(setListSongs(newListSongs));
    }
  };

  return (
    <>
      <Dialog
        open={isUpdateSongDialogOpen}
        onClose={() => setIsUpdateSongDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ mx: "auto" }}>
          <Typography
            fontWeight="700"
            fontSize="1.7rem"
            sx={{
              background: "linear-gradient(90deg, #4ADE80, #14B8A6, #3B82F6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            Update Song
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            sx={{ marginTop: 1 }}
            label="Title"
            variant="outlined"
            value={updateSong.title}
            onChange={(e) =>
              setUpdateSong({ ...updateSong, title: e.target.value })
            }
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Artist</InputLabel>
            <Select
              value={updateSong.artist}
              label="Artist"
              onChange={(e) =>
                setUpdateSong({ ...updateSong, artist: e.target.value })
              }
            >
              <MenuItem value="otherArtist">Other artist</MenuItem>
              {listArtists.map((artist, index) => (
                <MenuItem key={index} value={artist.artist}>
                  {artist.artist}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {updateSong.artist === "otherArtist" && (
            <TextField
              fullWidth
              label="New artist"
              value={updateSong.newArtist}
              onChange={(e) =>
                setUpdateSong({
                  ...updateSong,
                  newArtist: e.target.value,
                })
              }
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setIsUpdateSongDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Uploading...
              </Box>
            ) : (
              "Update Song"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateSongDialog;
