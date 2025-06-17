import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import {
  AddCircleOutlineSharp,
  QueueMusicSharp,
  Delete,
  LibraryMusic,
  MusicNote,
} from "@mui/icons-material";
import AddPlaylistDialog from "./AddPlaylistDialog";
import { useEffect, useState } from "react";
import playlistApi from "../api/modules/playlist.api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import PlaylistListSkeleton from "./skeletons/PlaylistListSkeleton";
import { Link } from "react-router-dom";
import { routesGen } from "../routes/routes";
import { useSelector, useDispatch } from "react-redux";
import { setAllPlaylist } from "../redux/slices/userSlice";
import { useTranslation } from "react-i18next";
import { setQueue, setCurrentSong } from "../redux/slices/playerSlice";

const PlaylistList = () => {
  const { user, playlist, allPlaylist } = useSelector((state) => state.user);
  const { isPlaying, queueType } = useSelector((state) => state.player);
  const [isAddPlaylistDialogOpen, setIsAddPlaylistDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletePlaylistRequest, setIsDeletePlaylistRequest] = useState(false);
  const [isDisplayPlaylistId, setIsDisplayPlaylistId] = useState(-1);
  const { t } = useTranslation();
  const currentPlayedPlaylist = playlist;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPlaylists = async () => {
      setIsLoading(true);

      const { response, error } = await playlistApi.getAllPlaylistsOfUser();
      console.log(response);

      setIsLoading(false);

      if (response) {
        console.log(response);
        dispatch(setAllPlaylist(response));
      }

      if (error) {
        console.log(error);
        toast.error(error.message);
      }
    };

    if (user) {
      fetchPlaylists();
    }
  }, [user]);

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
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        // minHeight: "100%",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        p: 2,
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={1}>
          <QueueMusicSharp sx={{ color: "primary.main" }} fontSize="medium" />
          <Typography variant="h6">Playlists</Typography>
        </Box>
        {user && (
          <IconButton
            onClick={() => setIsAddPlaylistDialogOpen(true)}
            color="primary"
            size="medium"
          >
            <AddCircleOutlineSharp />
          </IconButton>
        )}
      </Box>
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          scrollBehavior: "smooth",
          pr: 1,
          "&::-webkit-scrollbar": { width: 5, height: 5 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "primary.main",
            borderRadius: 5,
          },
        }}
      >
        {isLoading ? (
          <PlaylistListSkeleton />
        ) : (
          user && (
            <List>
              {allPlaylist.map((playlist) => (
                <ListItem
                  key={playlist.id}
                  sx={{
                    "&:hover .delete-icon": {
                      color: "primary.main",
                      opacity: 1,
                    },
                    cursor: "pointer",
                  }}
                  secondaryAction={
                    isDisplayPlaylistId === playlist.id ? null : (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        className="delete-icon"
                        sx={{
                          opacity: 0,
                          transition: "opacity 0.2s",
                          color: "primary.main",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePlaylistClick(playlist);
                        }}
                      >
                        <Delete />
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
                  <ListItemText
                    component={Link}
                    to={routesGen.playlist(playlist.id)}
                    sx={{
                      textDecoration: "none",
                      color: "primary.contrastText",
                    }}
                    primary={playlist.name}
                    onClick={() => setIsDisplayPlaylistId(playlist.id)}
                    // secondary={playlist.createdAt.}}
                  />
                </ListItem>
              ))}
            </List>
          )
        )}
      </Box>

      <AddPlaylistDialog
        isAddPlaylistDialogOpen={isAddPlaylistDialogOpen}
        setIsAddPlaylistDialogOpen={setIsAddPlaylistDialogOpen}
      />
    </Box>
  );
};

export default PlaylistList;
