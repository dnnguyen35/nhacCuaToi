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
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import adminApi from "../../../api/modules/admin.api";
import { useSelector, useDispatch } from "react-redux";
import {
  setListAlbums,
  setTotalAlbums,
} from "../../../redux/slices/statsDataSlice";

const AddAlbumDialog = () => {
  const { listAlbums, listArtists } = useSelector((state) => state.statsData);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const [newAlbum, setNewAlbum] = useState({
    title: "",
    artist: "",
  });

  const [files, setFiles] = useState({
    albumImageFile: null,
  });

  const imageInputRef = useRef(null);

  const handleSubmit = async () => {
    if (!files.albumImageFile) {
      return toast.error("Please upload album image file");
    }

    if (!newAlbum.title || newAlbum.title === "") {
      return toast.error("Please fill out album title");
    }

    if (newAlbum.title.length > 30) {
      return toast.error("Album's title can't exceed 25 characters");
    }

    if (newAlbum.artist === "") {
      return toast.error("Please choose artist");
    }

    if (newAlbum.artist.length > 17) {
      return toast.error("Artist's name can't exceed 17 characters ");
    }

    const artistId = listArtists.find((a) => a.artist === newAlbum.artist).id;

    const formData = new FormData();
    formData.append("title", newAlbum.title);
    formData.append("artistId", artistId);
    formData.append("albumImageFile", files.albumImageFile);

    setIsLoading(true);

    const { response, error } = await adminApi.createAlbum(formData);

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    }

    if (response) {
      setOpen(false);
      toast.success("Album created successfully");

      const newListAlbums = [
        ...listAlbums,
        { ...response?.newAlbum, artist: newAlbum.artist, songCount: 0 },
      ];
      dispatch(setListAlbums(newListAlbums));
      dispatch(setTotalAlbums(newListAlbums.length));
      setNewAlbum({ title: "", artist: "" });
      setFiles({ albumIamgeFile: null });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        onClick={() => setOpen(true)}
        startIcon={<CloudUploadIcon />}
      >
        Add Album
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
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
            Add New Album
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <Button
            variant="outlined"
            onClick={() => imageInputRef.current?.click()}
          >
            {files.albumImageFile
              ? `Image: ${files.albumImageFile.name.slice(0, 20)}`
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
            label="Title"
            variant="outlined"
            value={newAlbum.title}
            onChange={(e) =>
              setNewAlbum({ ...newAlbum, title: e.target.value })
            }
            fullWidth
          />

          <Autocomplete
            sx={{ width: "100%" }}
            options={[...listArtists.map((a) => a.artist)]}
            value={newAlbum.artist}
            onChange={(e, newValue) =>
              setNewAlbum({ ...newAlbum, artist: newValue || "" })
            }
            renderInput={(params) => (
              <TextField fullWidth {...params} label="Artist" />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={isLoading}>
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
              "Add Album"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddAlbumDialog;
