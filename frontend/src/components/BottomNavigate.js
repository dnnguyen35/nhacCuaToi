import { useEffect, useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
  Paper,
  Box,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
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
import { styled } from "@mui/material/styles";

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

const BottomNavigate = () => {
  const { appState } = useSelector((state) => state.appState);
  const { allPlaylist, user, playlist } = useSelector((state) => state.user);
  const currentPlayedPlaylist = playlist;

  const { isPlaying, queueType } = useSelector((state) => state.player);

  const [value, setValue] = useState(appState);
  const [openSwipeableDrawer, setOpenSwipeableDrawer] = useState(false);
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
          mx: 1,
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
            value="playlist"
            icon={<LibraryMusic />}
            onClick={(e) => {
              dispatch(setAppState("playlist"));
              setOpenSwipeableDrawer(true);
            }}
          />
        )}
      </BottomNavigation>

      {user && (
        <SwipeableDrawer
          anchor="bottom"
          open={openSwipeableDrawer}
          onClose={() => setOpenSwipeableDrawer(false)}
          onOpen={() => setOpenSwipeableDrawer(true)}
          disableSwipeToOpen={true}
          PaperProps={{
            sx: {
              width: "95%",
              margin: "0 auto",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: "50vh",
              overflow: "hidden",
            },
          }}
        >
          <Puller />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              marginTop: 1,
            }}
          >
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  sx={{ color: "primary.main" }}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenSwipeableDrawer(false);
                    setIsAddPlaylistDialogOpen(true);
                  }}
                >
                  <AddCircleOutline />
                </IconButton>
              }
            >
              <ListItemText
                primary={t("userMenu.createPlaylist")}
                primaryTypographyProps={{ noWrap: true }}
              />
            </ListItem>

            <Box
              sx={{
                overflow: "auto",
                scrollBehavior: "smooth",
                pr: 1,
                "&::-webkit-scrollbar": { width: 5 },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "primary.main",
                  borderRadius: 5,
                },
              }}
            >
              <List>
                {allPlaylist.map((playlist) => (
                  <ListItem
                    key={playlist.id}
                    divider
                    secondaryAction={
                      playlist.id === displayPlaylistId &&
                      appState === "playlist" ? (
                        <IconButton
                          edge="end"
                          sx={{ color: "primary.main" }}
                          size="small"
                        >
                          <Visibility />
                        </IconButton>
                      ) : (
                        <IconButton
                          edge="end"
                          sx={{ color: "error.main" }}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenSwipeableDrawer(false);
                            onDeletePlaylistClick(playlist);
                          }}
                        >
                          <DeleteForever />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "background.paper" }}>
                        <LibraryMusic
                          fontSize="medium"
                          sx={{
                            animation:
                              isPlaying &&
                              currentPlayedPlaylist.id === playlist.id &&
                              queueType === "playlist"
                                ? "spin 7s linear infinite"
                                : "none",
                            "@keyframes spin": {
                              from: { transform: "rotate(0deg)" },
                              to: { transform: "rotate(360deg)" },
                            },
                            color: "primary.main",
                          }}
                        />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemButton
                      component={Link}
                      to={routesGen.playlist(playlist.id)}
                      onClick={() => {
                        setDisplayPlaylistId(playlist.id);
                        setOpenSwipeableDrawer(false);
                      }}
                    >
                      <ListItemText
                        primary={playlist.name}
                        primaryTypographyProps={{ noWrap: true }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </SwipeableDrawer>
      )}

      <AddPlaylistDialog
        isAddPlaylistDialogOpen={isAddPlaylistDialogOpen}
        setIsAddPlaylistDialogOpen={setIsAddPlaylistDialogOpen}
      />
    </>
  );
};

export default BottomNavigate;
