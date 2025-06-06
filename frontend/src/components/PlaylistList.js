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
} from "@mui/icons-material";
import AddPlaylistDialog from "./AddPlaylistDialog";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import playlistApi from "../api/modules/playlist.api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import PlaylistListSkeleton from "./skeletons/PlaylistListSkeleton";
import { Link } from "react-router-dom";
import { routesGen } from "../routes/routes";
import { useDispatch } from "react-redux";
import { setAllPlaylist } from "../redux/slices/userSlice";
import { useTranslation } from "react-i18next";

const PlaylistList = () => {
  const { user } = useSelector((state) => state.user);
  const [playlistsList, setPlaylistsList] = useState([]);
  const [isAddPlaylistDialogOpen, setIsAddPlaylistDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletePlaylistRequest, setIsDeletePlaylistRequest] = useState(false);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPlaylists = async () => {
      setIsLoading(true);

      const { response, error } = await playlistApi.getAllPlaylistsOfUser();
      console.log(response);

      setIsLoading(false);

      if (response) {
        console.log(response);
        setPlaylistsList(response);
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

  const updatePlaylistsList = (newPlaylistsList) => {
    setPlaylistsList(newPlaylistsList);
    dispatch(setAllPlaylist(newPlaylistsList));
  };

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
      const newPlaylistsList = playlistsList.filter(
        (pl) => pl.id !== playlist.id
      );
      setPlaylistsList(newPlaylistsList);
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
        height: "343px",
        display: "flex",
        flexDirection: "column",
        p: 2,
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
          overflowY: "auto",
          scrollBehavior: "smooth",
          pr: 1,
          "&::-webkit-scrollbar": { width: 5 },
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
              {playlistsList.map((playlist, index) => (
                <ListItem
                  key={index}
                  sx={{
                    "&:hover .delete-icon": {
                      color: "primary.main",
                      opacity: 1,
                    },
                    cursor: "pointer",
                  }}
                  secondaryAction={
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
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      src={
                        "https://res.cloudinary.com/duccdrxot/image/upload/v1748339060/uv6xrfxtczqykyrrep9p.jpg"
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText
                    component={Link}
                    to={routesGen.playlist(playlist.id)}
                    sx={{
                      textDecoration: "none",
                      color: "primary.contrastText",
                    }}
                    primary={playlist.name}
                    secondary={`Songs ~ 25`}
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
        updatePlaylistsList={updatePlaylistsList}
      />
    </Box>
  );
};

export default PlaylistList;
