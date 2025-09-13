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
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import adminApi from "../../../api/modules/admin.api";
import { useSelector, useDispatch } from "react-redux";
import {
  setListAlbums,
  setListSongs,
} from "../../../redux/slices/statsDataSlice";

const UpdateAlbumDialog = ({
  album,
  isUpdateAlbumDialogOpen,
  setIsUpdateAlbumDialogOpen,
  setAlbum,
}) => {
  const { listAlbums, listArtists, listSongs } = useSelector(
    (state) => state.statsData
  );
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [updateAlbum, setUpdateAlbum] = useState({
    title: "",
    artist: "",
  });

  const [files, setFiles] = useState({
    albumImageFile: null,
  });

  const imageInputRef = useRef(null);

  useEffect(() => {
    setUpdateAlbum({
      title: album.title,
      artist: album.artist,
    });
  }, [album]);

  const handleSubmit = async () => {
    if (!updateAlbum || updateAlbum.title === "") {
      return toast.error("Please fill out album title");
    }

    if (updateAlbum.artist === "") {
      return toast.error("Please choose artist");
    }

    const artistId = listArtists.find(
      (a) => a.artist === updateAlbum.artist
    ).id;

    const formData = new FormData();
    formData.append("title", updateAlbum.title);
    formData.append("artistId", artistId);
    formData.append("albumImageFile", files.albumImageFile);

    setIsLoading(true);

    const { response, error } = await adminApi.updateAlbum({
      albumId: album.id,
      formData,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    }

    if (response) {
      setIsUpdateAlbumDialogOpen(false);
      toast.success("Album updated succeefully");

      const newListAlbums = listAlbums.map((album) =>
        album.id === response.updatedAlbum.id
          ? {
              ...album,
              title: response.updatedAlbum.title,
              artist: listArtists.find(
                (a) => a.id === response.updatedAlbum.artistId
              ).artist,
              imageUrl: response.updatedAlbum.imageUrl,
            }
          : album
      );

      const newListSongs = listSongs.map((song) =>
        song.albumId === response.updatedAlbum.id
          ? { ...song, albumTitle: response.updatedAlbum.title }
          : song
      );

      dispatch(setListAlbums(newListAlbums));
      dispatch(setListSongs(newListSongs));

      setUpdateAlbum({ title: "", artist: "" });
      setAlbum(null);
    }
  };

  return (
    <>
      <Dialog
        open={isUpdateAlbumDialogOpen}
        onClose={() => setIsUpdateAlbumDialogOpen(false)}
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
          <Button
            variant="outlined"
            onClick={() => imageInputRef.current?.click()}
          >
            {files.image
              ? `Image: ${files.image.name.slice(0, 20)}`
              : "Choose Artwork"}
          </Button>
          <input
            ref={imageInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) =>
              setFiles((prev) => ({
                ...prev,
                albumImageFile: e.target.files?.[0] || null,
              }))
            }
          />

          <TextField
            sx={{ marginTop: 1 }}
            label="Title"
            variant="outlined"
            value={updateAlbum.title}
            onChange={(e) =>
              setUpdateAlbum({ ...updateAlbum, title: e.target.value })
            }
            fullWidth
          />

          <Autocomplete
            sx={{ width: "100%" }}
            options={[...listArtists.map((a) => a.artist)]}
            value={updateAlbum.artist}
            onChange={(e, newValue) =>
              setUpdateAlbum({ ...updateAlbum, artist: newValue || "" })
            }
            renderInput={(params) => (
              <TextField fullWidth {...params} label="Artist" />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setIsUpdateAlbumDialogOpen(false)}
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

export default UpdateAlbumDialog;
