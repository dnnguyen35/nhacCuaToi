import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import {
  PlayArrow,
  FavoriteBorderOutlined,
  PlaylistAdd,
  Favorite,
  Pause,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import Marquee from "react-fast-marquee";
import { useState } from "react";
import {
  togglePlay,
  setCurrentSong,
  initializeQueue,
} from "../redux/slices/playerSlice";
import { setWishlist } from "../redux/slices/userSlice";
import wishlistApi from "../api/modules/wishlist.api";
import { toast } from "react-toastify";
import { setQueue, deleteSongFromQueue } from "../redux/slices/playerSlice";
import { useTranslation } from "react-i18next";

const GridSongList = ({ songs, setSelectedSong, setIsPlaylistPopupOpen }) => {
  const { user, wishlist } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { isPlaying, currentSong, queueType, queue } = useSelector(
    (state) => state.player
  );

  const [onAddSongToWishlistRequest, setOnAddSongToWishlistRequest] =
    useState(false);

  const onAddSongToWishlistClick = async (song) => {
    if (onAddSongToWishlistRequest) return;

    if (wishlist.some((s) => s.id === song.id)) {
      onDeleteSongFromWishlist(song);
      return;
    }

    setOnAddSongToWishlistRequest(true);

    const { response, error } = await wishlistApi.addSong({
      songId: song.id,
    });

    setOnAddSongToWishlistRequest(false);

    if (response) {
      dispatch(setWishlist([...wishlist, response]));
      toast.success(t("responseSuccess.Added song to wishlist successfully"));

      if (queueType === "wishlist") {
        dispatch(setQueue([...wishlist, response]));
      }
    }

    if (error) {
      toast.error(t(`responseError.${error.message}`));
    }
  };

  const onDeleteSongFromWishlist = async (deleteSong) => {
    setOnAddSongToWishlistRequest(true);

    const { response, error } = await wishlistApi.deleteSong({
      songId: deleteSong.id,
    });

    setOnAddSongToWishlistRequest(false);

    if (response) {
      const isCurrentWishlistPlaying = wishlist.some(
        (song) => song.id === currentSong?.id
      );

      if (
        isCurrentWishlistPlaying &&
        queue.length > 0 &&
        queueType === "wishlist"
      ) {
        dispatch(deleteSongFromQueue(deleteSong));
      }

      const newWishlist = wishlist.filter((s) => s.id !== deleteSong.id);
      dispatch(setWishlist([...newWishlist]));
      toast.success(
        t("responseSuccess.Removed song from wishlist successfully")
      );
    }

    if (error) {
      toast.error(t(`responseError.${error.message}`));
    }
  };
  return (
    <Box
      sx={{
        overflowX: "auto",
        whiteSpace: "nowrap",
        px: 2,
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": { height: 5 },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "primary.main",
          borderRadius: 5,
        },
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 3,
          marginBottom: 2,
        }}
      >
        {songs.map((song, i) => (
          <Card
            key={i}
            sx={{
              minWidth: 152,
              maxWidth: 152,
              minHeight: 240,
              maxHeight: 240,
              flexShrink: 0,
              px: 1,
              py: 1,
              borderRadius: 2,
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={song.imageUrl}
              sx={{ borderRadius: 2 }}
            />
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",

                flexDirection: "column",
              }}
            >
              <Box sx={{ overflow: "hidden", textAlign: "center" }}>
                {isPlaying && currentSong.id === song.id ? (
                  <>
                    <Marquee
                      pauseOnHover={true}
                      speed={50}
                      play={isPlaying && currentSong.id === song.id}
                    >
                      <Typography variant="body1" fontWeight="bold">
                        {`${song.title}\u00A0\u00A0\u00A0`}
                      </Typography>
                    </Marquee>
                  </>
                ) : (
                  <Typography variant="body1" fontWeight="bold">
                    {song.title.length > 12
                      ? `${song.title.slice(0, 12)}...`
                      : song.title}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  {song.artist.length > 12
                    ? `${song.artist.slice(0, 12)}...`
                    : song.artist}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: { xs: "flex", sm: "flex", md: "flex" },
                  justifyContent: "center",
                }}
              >
                {user && (
                  <>
                    <IconButton
                      color="primary"
                      size="small"
                      sx={{ pr: 1 }}
                      onClick={() => onAddSongToWishlistClick(song)}
                    >
                      {wishlist.some((s) => s.id === song.id) ? (
                        <Favorite />
                      ) : (
                        <FavoriteBorderOutlined />
                      )}
                    </IconButton>
                    <IconButton
                      color="primary"
                      size="small"
                      sx={{ pr: 1 }}
                      onClick={() => {
                        setSelectedSong(song);
                        setIsPlaylistPopupOpen(true);
                      }}
                    >
                      <PlaylistAdd />
                    </IconButton>
                  </>
                )}
                {isPlaying && currentSong.id === song.id ? (
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{ pr: 1 }}
                    onClick={() => dispatch(togglePlay())}
                  >
                    <Pause />
                  </IconButton>
                ) : (
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{ pr: 1 }}
                    onClick={() => {
                      dispatch(initializeQueue([...songs]));
                      dispatch(setCurrentSong(song));
                    }}
                  >
                    <PlayArrow />
                  </IconButton>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default GridSongList;
