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
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import adminApi from "../../../api/modules/admin.api";

const AddSongDialog = ({ songsData, updateSongsList, onTotalSongsChange }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listSongsData, setListSongsData] = useState([]);

  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    duration: "0",
    newArtist: "",
  });

  const [files, setFiles] = useState({
    audio: null,
    image: null,
  });

  const audioInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    setListSongsData(songsData);
  }, [songsData]);

  const handleSubmit = async () => {
    if (!files.audio || !files.image) {
      return toast.error("Please upload both audio and image files");
    }

    if (!newSong.title || newSong.title === "") {
      return toast.error("Please fill out songs title");
    }

    if (!newSong.duration || newSong.duration === 0) {
      return toast.error("Duration must be a number");
    }

    if ((newSong.artist === "") & (newSong.newArtist === "")) {
      return toast.error("Please choose artist");
    }

    console.log("newsong: ", newSong);

    console.log("newFiles: ", files);

    const artistName =
      newSong.artist !== "" && newSong.artist !== "otherArtist"
        ? newSong.artist
        : newSong.newArtist;

    const formData = new FormData();
    formData.append("title", newSong.title);
    formData.append("artist", artistName);
    formData.append("duration", newSong.duration);
    formData.append("audioFile", files.audio);
    formData.append("imageFile", files.image);

    for (let [key, val] of formData.entries()) {
      console.log(`${key}:`, typeof val);
    }

    setIsLoading(true);

    const { response, error } = await adminApi.createSong(formData);

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    }

    if (response) {
      setOpen(false);
      toast.success("Song created succeefully");
      console.log("affter add song: ", response);
      const newSongsData = [...listSongsData, response];
      setListSongsData(newSongsData);
      updateSongsList(newSongsData);
      onTotalSongsChange(newSongsData.length);
      setNewSong({ title: "", artist: "", duration: "0", newArtist: "" });
      setFiles({ audio: null, image: null });
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
        Add Song
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
            Add New Song
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
                image: e.target.files?.[0] || null,
              }))
            }
          />

          <Button
            variant="outlined"
            onClick={() => audioInputRef.current?.click()}
          >
            {files.audio
              ? `Audio: ${files.audio.name.slice(0, 20)}`
              : "Choose Audio File"}
          </Button>
          <input
            ref={audioInputRef}
            type="file"
            hidden
            accept=".mp3,audio/mpeg"
            onChange={(e) =>
              setFiles((prev) => ({
                ...prev,
                audio: e.target.files?.[0] || null,
              }))
            }
          />

          <TextField
            label="Title"
            variant="outlined"
            value={newSong.title}
            onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
            fullWidth
          />

          <TextField
            label="Duration (seconds)"
            type="number"
            inputProps={{ min: 0 }}
            variant="outlined"
            value={newSong.duration}
            onChange={(e) =>
              setNewSong({ ...newSong, duration: e.target.value })
            }
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Artist</InputLabel>
            <Select
              value={newSong.artist}
              label="Artist"
              onChange={(e) =>
                setNewSong({ ...newSong, artist: e.target.value })
              }
            >
              <MenuItem value="otherArtist">Other artist</MenuItem>
              {listSongsData.map((song) => (
                <MenuItem key={song.id} value={song.artist}>
                  {song.artist}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {newSong.artist === "otherArtist" && (
            <TextField
              fullWidth
              label="New artist"
              value={newSong.newArtist}
              onChange={(e) =>
                setNewSong({
                  ...newSong,
                  newArtist: e.target.value,
                })
              }
            />
          )}
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
              "Add Song"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddSongDialog;
