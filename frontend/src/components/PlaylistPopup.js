import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Autocomplete,
  TextField,
  Alert,
} from "@mui/material";
import playlistApi from "../api/modules/playlist.api";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setPlaylist } from "../redux/slices/userSlice";
import { setQueue } from "../redux/slices/playerSlice";
import { useTranslation } from "react-i18next";

const PlaylistPopup = ({
  isPlaylistPopupOpen,
  setIsPlaylistPopupOpen,
  selectedSong,
}) => {
  const { allPlaylist, playlist } = useSelector((state) => state.user);
  const { queueType } = useSelector((state) => state.player);
  const [onRequest, setOnRequest] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const onAddSongToPlaylistClick = async (playlistId, songId) => {
    if (onRequest) return;

    if (selectedPlaylistId === "") {
      setErrorMessage(t("responseError.Please chose one playlist to add"));
      return;
    }

    setOnRequest(true);

    const { response, error } = await playlistApi.addSongToPlaylist({
      playlistId,
      songId,
    });

    setOnRequest(false);

    if (response) {
      toast.success(t("responseSuccess.Added song to playlist successfully"));
      setErrorMessage("");
      setSelectedPlaylistId("");
      setIsPlaylistPopupOpen(false);
      if (playlist?.id === playlistId && playlist?.Songs.length > 0) {
        dispatch(setPlaylist([...playlist.Songs, response]));
      }
      if (queueType === "playlist" && playlist?.id === playlistId) {
        dispatch(setQueue([...playlist.Songs, response]));
      }
    }

    if (error) {
      toast.error(t(`responseError.${error.message}`));
    }
  };

  return (
    <>
      <Dialog
        open={isPlaylistPopupOpen}
        onClose={() => {
          setIsPlaylistPopupOpen(false);
          setErrorMessage("");
          setSelectedPlaylistId("");
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
            {t("userMenu.addSongIntoPlaylist")}
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <Autocomplete
            sx={{ width: "100%", marginTop: 1 }}
            options={[...allPlaylist]}
            getOptionLabel={(option) => option.name}
            value={allPlaylist.find((p) => p.id === selectedPlaylistId) || null}
            onChange={(e, newValue) =>
              setSelectedPlaylistId(newValue?.id || "")
            }
            renderInput={(params) => (
              <TextField
                fullWidth
                {...params}
                label={t("formField.choosePlaylist")}
              />
            )}
          />

          {errorMessage && (
            <Box sx={{ marginTop: 2 }}>
              <Alert severity="warning" variant="outlined">
                {errorMessage}
              </Alert>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setIsPlaylistPopupOpen(false);
              setErrorMessage("");
              setSelectedPlaylistId("");
            }}
            disabled={onRequest}
          >
            {t("userMenu.cancel")}
          </Button>
          <Button
            onClick={() =>
              onAddSongToPlaylistClick(selectedPlaylistId, selectedSong.id)
            }
            variant="contained"
            disabled={onRequest}
          >
            {onRequest ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
              </Box>
            ) : (
              t("userMenu.add")
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PlaylistPopup;
