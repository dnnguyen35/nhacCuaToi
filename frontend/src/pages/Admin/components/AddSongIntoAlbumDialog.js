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
  Autocomplete,
  Checkbox,
  Avatar,
} from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import adminApi from "../../../api/modules/admin.api";
import { useSelector, useDispatch } from "react-redux";
import {
  setListAlbums,
  setListSongs,
} from "../../../redux/slices/statsDataSlice";

const AddSongIntoAlbumDialog = ({
  album,
  isAddSongIntoAlbumDialogOpen,
  setIsAddSongIntoAlbumDialogOpen,
  setAlbum,
}) => {
  const { listAlbums, listSongs } = useSelector((state) => state.statsData);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [songArray, setSongArray] = useState([]);

  useEffect(() => {
    setSongArray([]);
  }, [album]);

  const handleSubmit = async () => {
    if (!songArray || songArray.length === 0) {
      return toast.error("Please choose song to add");
    }

    const songIdArray = songArray.map((song) => song.id);

    setIsLoading(true);

    const { response, error } = await adminApi.addSongIntoAlbum({
      albumId: album.id,
      songIdArray: songIdArray,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    }

    if (response) {
      setIsAddSongIntoAlbumDialogOpen(false);
      toast.success(response.message);

      const newListAlbums = listAlbums.map((a) =>
        a.id === album.id
          ? {
              ...album,
              songCount: response.songInAlbum.length,
            }
          : a
      );

      const songIdInAlbum = response.songInAlbum.map((song) => song.id);

      const newListSongs = listSongs.map((song) =>
        songIdInAlbum.includes(song.id)
          ? { ...song, albumId: album.id, albumTitle: album.title }
          : song
      );

      dispatch(setListAlbums(newListAlbums));
      dispatch(setListSongs(newListSongs));

      setSongArray([]);
      setAlbum(null);
    }
  };

  return (
    <>
      <Dialog
        open={isAddSongIntoAlbumDialogOpen}
        onClose={() => setIsAddSongIntoAlbumDialogOpen(false)}
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
            Update Album
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <Autocomplete
            sx={{ width: "100%" }}
            multiple
            disableCloseOnSelect
            options={listSongs.filter(
              (song) => song.artistId === album.artistId
            )}
            getOptionLabel={(option) => option.title}
            value={songArray}
            onChange={(e, newValue) => setSongArray(newValue)}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={
                    <CheckBoxOutlineBlank
                      fontSize="small"
                      color="primary.main"
                    />
                  }
                  checkedIcon={
                    <CheckBox fontSize="small" color="primary.main" />
                  }
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                <Avatar
                  src={option.imageUrl}
                  alt={option.title}
                  sx={{ width: 30, height: 30, marginRight: 1 }}
                  variant="rounded"
                />
                {option.title}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Songs" placeholder="Choose song" />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setIsAddSongIntoAlbumDialogOpen(false)}
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
                Updating...
              </Box>
            ) : (
              "Update Album"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddSongIntoAlbumDialog;
