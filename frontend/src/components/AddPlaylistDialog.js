import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import playlistApi from "../api/modules/playlist.api";
import { useTranslation } from "react-i18next";
import { setAllPlaylist } from "../redux/slices/userSlice";

const AddPlaylistDialog = ({
  isAddPlaylistDialogOpen,
  setIsAddPlaylistDialogOpen,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const { allPlaylist } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isAddPlaylistDialogOpen) {
      setPlaylistName("");
    }
  }, [isAddPlaylistDialogOpen]);

  const handleCreatePlaylistClick = async () => {
    if (!playlistName.trim()) {
      return toast.error(t("responseError.PlaylistName is required"));
    }

    setIsLoading(true);

    const { response, error } = await playlistApi.createPlaylist({
      playlistName,
    });

    setIsLoading(false);

    if (error) {
      toast.error(t(`responseError.${error.message}`));
      return;
    }

    if (response) {
      toast.success(t("responseSuccess.Playlist created successfully"));
      dispatch(setAllPlaylist([...allPlaylist, response]));
      setIsAddPlaylistDialogOpen(false);
      setPlaylistName("");
    }
  };

  return (
    <Dialog
      open={isAddPlaylistDialogOpen}
      onClose={() => {
        setIsAddPlaylistDialogOpen(false);
      }}
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
          Create Playlist
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          sx={{ marginTop: 1 }}
          label={t("formField.playlistName")}
          variant="outlined"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          fullWidth
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setIsAddPlaylistDialogOpen(false)}
          disabled={isLoading}
        >
          {t("userMenu.cancel")}
        </Button>
        <Button
          onClick={handleCreatePlaylistClick}
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Creating...
            </Box>
          ) : (
            t("userMenu.createPlaylist")
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPlaylistDialog;
