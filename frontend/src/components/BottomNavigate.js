import { useEffect, useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Popper,
  Typography,
  IconButton,
  Paper,
  Box,
  ClickAwayListener,
  Divider,
  Button,
} from "@mui/material";
import {
  LibraryMusic,
  AddCircleOutline,
  DeleteForever,
  Visibility,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import menuConfigs from "../configs/menu.configs";
import { setAppState } from "../redux/slices/appStateSlice";
import { Link } from "react-router-dom";
import { routesGen } from "../routes/routes";
import AddPlaylistDialog from "./AddPlaylistDialog";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import playlistApi from "../api/modules/playlist.api";
import { toast } from "react-toastify";
import { setQueue, setCurrentSong } from "../redux/slices/playerSlice";
import { setAllPlaylist } from "../redux/slices/userSlice";

const BottomNavigate = () => {
  const { appState } = useSelector((state) => state.appState);
  const { allPlaylist, user, playlist } = useSelector((state) => state.user);
  const currentPlayedPlaylist = playlist;

  const [value, setValue] = useState(appState);
  const [openPopper, setOpenPopper] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAddPlaylistDialogOpen, setIsAddPlaylistDialogOpen] = useState(false);
  const [isDeletePlaylistRequest, setIsDeletePlaylistRequest] = useState(false);
  const [displayPlaylistId, setDisplayPlaylistId] = useState(-1);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    setValue(appState);
    if (appState !== "playlist") {
      setDisplayPlaylistId(-1);
    }
  }, [appState]);

  const onDeletePlaylistClick = async (playlist) => {
    const confirm = await Swal.fire({
      title: t("sweetalert.Are you sure?"),
      text: `${t("sweetalert.Do you really want to delete")} "${
        playlist.name
      }"${t("sweetalert.? This action cannot be undone.")}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("sweetalert.Yes, delete it!"),
      cancelButtonText: t("sweetalert.Cancel"),
    });

    if (!confirm.isConfirmed) return;

    if (isDeletePlaylistRequest) return;

    setIsDeletePlaylistRequest(true);

    const { response, error } = await playlistApi.deletePlaylist({
      playlistId: playlist.id,
    });

    setIsDeletePlaylistRequest(false);

    if (response) {
      toast.success(t(`responseSuccess.${response?.message}`));

      if (currentPlayedPlaylist.id === playlist.id) {
        dispatch(setQueue([]));
        dispatch(setCurrentSong(null));
      }

      const newPlaylistsList = allPlaylist.filter(
        (pl) => pl.id !== playlist.id
      );
      dispatch(setAllPlaylist(newPlaylistsList));
    }

    if (error) {
      toast.error(t(`responseError.${error.message}`));
    }
  };

  return (
    <>
      <BottomNavigation
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 125,
          bgcolor: "background.paper",
          mx: 2,
          p: 1,
          px: { xs: 1, sm: 5 },
          borderRadius: 5,
          boxShadow: 3,
          gap: 1,
        }}
        value={value}
        onChange={(e, val) => setValue(val)}
      >
        {menuConfigs.main.map((item, index) => (
          <BottomNavigationAction
            sx={{
              color: appState.includes(item.state)
                ? "primary.main"
                : "primary.contrastText",
              textTransform: "capitalize",
            }}
            key={index}
            label={item.display}
            value={item.display}
            icon={item.icon}
            component={Link}
            to={item.path}
          />
        ))}
        {user && (
          <BottomNavigationAction
            sx={{
              color: appState.includes("Playlist")
                ? "primary.main"
                : "primary.contrastText",
              textTransform: "capitalize",
            }}
            label="Playlists"
            value="playlist"
            icon={<LibraryMusic />}
            onClick={(e) => {
              dispatch(setAppState("playlist"));
              setAnchorEl(e.currentTarget);
              setOpenPopper(true);
            }}
          />
        )}
      </BottomNavigation>

      {user && (
        <Popper
          open={openPopper}
          anchorEl={anchorEl}
          placement="top"
          style={{ zIndex: 1200 }}
        >
          <ClickAwayListener onClickAway={() => setOpenPopper(false)}>
            <Paper sx={{ p: 1, borderRadius: 2, minWidth: 150 }}>
              <Box display="flex" flexDirection="column">
                <IconButton
                  onClick={() => {
                    setOpenPopper(false);
                    setIsAddPlaylistDialogOpen(true);
                  }}
                  sx={{
                    justifyContent: "flex-start",
                    px: 2,
                    gap: 1,
                    color: "primary.main",
                  }}
                >
                  <Typography
                    color="text.primary"
                    fontWeight={"bold"}
                    textTransform="capitalize"
                  >
                    {t("userMenu.createPlaylist")}
                  </Typography>
                  <AddCircleOutline />
                </IconButton>
                {allPlaylist.map((playlist) => (
                  <>
                    <Divider sx={{ borderColor: "primary.main" }} />
                    <Box
                      key={playlist.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                      }}
                    >
                      <Button
                        component={Link}
                        to={routesGen.playlist(playlist.id)}
                        onClick={() => {
                          setDisplayPlaylistId(playlist.id);
                          setOpenPopper(false);
                        }}
                        sx={{
                          justifyContent: "flex-start",
                          textTransform: "none",
                          flex: 1,
                          color: "text.primary",
                        }}
                      >
                        {playlist.name}
                      </Button>

                      {playlist.id === displayPlaylistId &&
                      appState === "playlist" ? (
                        <IconButton sx={{ color: "primary.main", mr: 1 }}>
                          <Visibility />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => {
                            setOpenPopper(false);
                            onDeletePlaylistClick(playlist);
                          }}
                          sx={{ color: "error.main", mr: 1 }}
                        >
                          <DeleteForever />
                        </IconButton>
                      )}
                    </Box>
                  </>
                ))}
              </Box>
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}
      <AddPlaylistDialog
        isAddPlaylistDialogOpen={isAddPlaylistDialogOpen}
        setIsAddPlaylistDialogOpen={setIsAddPlaylistDialogOpen}
      />
    </>
  );
};

export default BottomNavigate;
