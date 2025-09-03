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
  setListSongs,
  setTotalSongs,
  setListArtists,
  setTotalArtists,
} from "../../../redux/slices/statsDataSlice";
import { formatMinuteToSecond } from "../../../utils/formatMinuteToSecond";
import { formatDurationToHMS } from "../../../utils/formatDurationToHMS";

const AddSongDialog = () => {
  const { listSongs, listArtists } = useSelector((state) => state.statsData);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const formatAudioDurationToMinute = async (audio) => {
    if (!audio) {
      setNewSong({ ...newSong, duration: "0" });
      return;
    }
    const arrayBuffer = await audio.arrayBuffer();
    const audioContext = new window.AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const audioMinute = formatDurationToHMS(audioBuffer.duration);
    setNewSong({ ...newSong, duration: audioMinute });
  };

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

  const handleSubmit = async () => {
    if (!files.audio || !files.image) {
      return toast.error("Please upload both audio and image files");
    }

    if (!newSong.title || newSong.title === "") {
      return toast.error("Please fill out songs title");
    }

    if (newSong.title.length > 25) {
      return toast.error("Song's title can't exceed 25 characters");
    }

    if (newSong.artist === "") {
      return toast.error("Please choose artist");
    }

    if ((newSong.artist === "Other artist") & (newSong.newArtist === "")) {
      return toast.error("Please choose artist");
    }

    if (newSong.artist.length > 17 || newSong.newArtist.length > 17) {
      return toast.error("Artist's name can't exceed 17 characters ");
    }

    const artistName =
      newSong.artist !== "" && newSong.artist !== "Other artist"
        ? listArtists.find((a) => a.artist === newSong.artist).id
        : newSong.newArtist;

    const formData = new FormData();
    formData.append("title", newSong.title);
    formData.append("artist", artistName);
    formData.append("duration", formatMinuteToSecond(newSong.duration));
    formData.append("audioFile", files.audio);
    formData.append("imageFile", files.image);

    setIsLoading(true);

    const { response, error } = await adminApi.createSong(formData);

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    }

    if (response) {
      if (newSong.newArtist && newSong.newArtist !== "") {
        const newListArtists = [
          ...listArtists,
          {
            ...response.newArtist,
            songCount: 1,
            playlistCount: 0,
            wishlistCount: 0,
          },
        ];

        dispatch(setListArtists(newListArtists));
        dispatch(setTotalArtists(newListArtists.length));
      } else {
        const newListArtists = listArtists.map((artist) =>
          artist.id === response.newArtist.id
            ? { ...artist, songCount: artist.songCount + 1 }
            : artist
        );

        dispatch(setListArtists(newListArtists));
        dispatch(setTotalArtists(newListArtists.length));
      }

      setOpen(false);
      toast.success("Song created succeefully");

      const newListSongs = [
        ...listSongs,
        { ...response?.newSong, playlistCount: 0, wishlistCount: 0 },
      ];
      dispatch(setListSongs(newListSongs));
      dispatch(setTotalSongs(newListSongs.length));
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
            onChange={async (e) => {
              setFiles((prev) => ({
                ...prev,
                audio: e.target.files?.[0] || null,
              }));
              await formatAudioDurationToMinute(e.target.files?.[0]);
            }}
          />

          <TextField
            label="Title"
            variant="outlined"
            value={newSong.title}
            onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
            fullWidth
          />

          <TextField
            label="Duration (minutes)"
            type="text"
            InputProps={{ readOnly: true }}
            variant="outlined"
            value={newSong.duration}
            onChange={(e) =>
              setNewSong({ ...newSong, duration: e.target.value })
            }
            fullWidth
          />

          <Autocomplete
            sx={{ width: "100%" }}
            options={["Other artist", ...listArtists.map((a) => a.artist)]}
            value={newSong.artist}
            onChange={(e, newValue) =>
              setNewSong({ ...newSong, artist: newValue || "" })
            }
            renderInput={(params) => (
              <TextField fullWidth {...params} label="Artist" />
            )}
          />

          {newSong.artist === "Other artist" && (
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
