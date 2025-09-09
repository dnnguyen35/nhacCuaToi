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
  setListArtists,
  setTotalArtists,
} from "../../../redux/slices/statsDataSlice";

const AddArtistDialog = () => {
  const { listArtists } = useSelector((state) => state.statsData);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const [newArtist, setNewArtist] = useState({
    artist: "",
  });

  const [files, setFiles] = useState({
    artistImageFile: null,
  });

  const imageInputRef = useRef(null);

  const handleSubmit = async () => {
    if (!files.artistImageFile) {
      return toast.error("Please upload artist image file");
    }

    if (!newArtist.artist || newArtist.artist === "") {
      return toast.error("Please fill out artist name");
    }

    if (newArtist.artist.length > 25) {
      return toast.error("Artist's name can't exceed 25 characters");
    }

    const formData = new FormData();
    formData.append("artist", newArtist.artist);
    formData.append("artistImageFile", files.artistImageFile);

    setIsLoading(true);

    const { response, error } = await adminApi.createArtist(formData);

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    }

    if (response) {
      const newListArtists = [
        ...listArtists,
        {
          ...response.newArtist,
          songCount: 0,
          playlistCount: 0,
          wishlistCount: 0,
        },
      ];

      dispatch(setListArtists(newListArtists));
      dispatch(setTotalArtists(newListArtists.length));

      setOpen(false);
      toast.success("Artist created succeefully");

      setNewArtist({ artist: "" });
      setFiles({ artistImageFile: null });
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
        Add Artist
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
            Add New Artist
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
            label="Artist"
            variant="outlined"
            value={newArtist.artist}
            onChange={(e) =>
              setNewArtist({ ...newArtist, artist: e.target.value })
            }
            fullWidth
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
              "Add Artist"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddArtistDialog;
