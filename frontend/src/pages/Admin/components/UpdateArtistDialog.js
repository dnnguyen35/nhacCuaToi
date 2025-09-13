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
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import adminApi from "../../../api/modules/admin.api";
import { useSelector, useDispatch } from "react-redux";
import {
  setListArtists,
  setTotalArtists,
  setListAlbums,
  setListSongs,
} from "../../../redux/slices/statsDataSlice";
import { useRef } from "react";

const UpdateArtistDialog = ({
  artistToUpdate,
  isUpdateArtistDialogOpen,
  setIsUpdateArtistDialogOpen,
  setArtistToUpdate,
}) => {
  const { listArtists, listSongs, listAlbums } = useSelector(
    (state) => state.statsData
  );
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [updateArtist, setUpdateArtist] = useState({
    artist: "",
  });

  const [files, setFiles] = useState({
    artistImageFile: null,
  });

  const imageInputRef = useRef(null);

  useEffect(() => {
    setUpdateArtist({
      artist: artistToUpdate.artist,
    });
  }, [artistToUpdate]);

  const handleSubmit = async () => {
    if (!updateArtist.artist || updateArtist.artist === "") {
      return toast.error("Please fill out artist name");
    }

    const formData = new FormData();
    formData.append("artist", updateArtist.artist);
    formData.append("artistImageFile", files.artistImageFile);

    setIsLoading(true);

    const { response, error } = await adminApi.updateArtist({
      artistId: artistToUpdate.id,
      formData,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    }

    if (response) {
      const newListArtists = listArtists.map((artist) =>
        artist.id === response.updatedArtist.id
          ? {
              ...artist,
              imageUrl: response.updatedArtist.imageUrl,
              artist: response.updatedArtist.artist,
            }
          : artist
      );

      const newListSongs = listSongs.map((song) =>
        song.artistId === response.updatedArtist.id
          ? { ...song, artist: response.updatedArtist.artist }
          : song
      );

      const newListAlbums = listAlbums.map((album) =>
        album.artistId === response.updatedArtist.id
          ? { ...album, artist: response.updatedArtist.artist }
          : album
      );

      dispatch(setListSongs(newListSongs));
      dispatch(setListAlbums(newListAlbums));

      dispatch(setListArtists(newListArtists));
      dispatch(setTotalArtists(newListArtists.length));

      setIsUpdateArtistDialogOpen(false);
      toast.success("Artist updated successfully");

      setUpdateArtist({ artist: "" });
      setFiles({ artistImageFile: null });
      setArtistToUpdate(null);
    }
  };

  return (
    <>
      <Dialog
        open={isUpdateArtistDialogOpen}
        onClose={() => setIsUpdateArtistDialogOpen(false)}
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
            Update Artist
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <Button
            variant="outlined"
            onClick={() => imageInputRef.current?.click()}
          >
            {files.artistImageFile
              ? `Image: ${files.artistImageFile.name.slice(0, 20)}`
              : "Choose Artist Image"}
          </Button>
          <input
            ref={imageInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) =>
              setFiles((prev) => ({
                ...prev,
                artistImageFile: e.target.files?.[0] || null,
              }))
            }
          />

          <TextField
            sx={{ marginTop: 1 }}
            label="Artist"
            variant="outlined"
            value={updateArtist.artist}
            onChange={(e) =>
              setUpdateArtist({ ...updateArtist, artist: e.target.value })
            }
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setIsUpdateArtistDialogOpen(false)}
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
              "Update Artist"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateArtistDialog;
