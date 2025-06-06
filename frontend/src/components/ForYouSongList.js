import { Box, Typography, IconButton, Pagination } from "@mui/material";
import {
  PlayArrow,
  Pause,
  PlaylistAddCheckCircleOutlined,
  FavoriteBorderOutlined,
  Favorite,
  PlaylistAdd,
} from "@mui/icons-material";
import Marquee from "react-fast-marquee";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  togglePlay,
  setCurrentSong,
  initializeQueue,
} from "../redux/slices/playerSlice";
import { setWishlist } from "../redux/slices/userSlice";
import wishlistApi from "../api/modules/wishlist.api";
import { toast } from "react-toastify";
import { setQueue } from "../redux/slices/playerSlice";

const songsPerPage = 6;

const ForYouSongList = ({ songs, setSelectedSong, setIsPlaylistPopupOpen }) => {
  const { user, wishlist } = useSelector((state) => state.user);
  const { isPlaying, currentSong, queueType } = useSelector(
    (state) => state.player
  );
  const [page, setPage] = useState(1);
  const [onAddSongToWishlistRequest, setOnAddSongToWishlistRequest] =
    useState(false);

  const dispatch = useDispatch();

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const currentSongs = songs.slice(
    (page - 1) * songsPerPage,
    page * songsPerPage
  );

  const onAddSongToWishlistClick = async (song) => {
    if (onAddSongToWishlistRequest) return;

    if (wishlist.some((s) => s.id === song.id)) {
      onDeleteSongFromWishlist(song.id);
      return;
    }

    setOnAddSongToWishlistRequest(true);

    const { response, error } = await wishlistApi.addSong({ songId: song.id });

    setOnAddSongToWishlistRequest(false);

    if (response) {
      dispatch(setWishlist([...wishlist, response]));
      toast.success("Added song to wishlist successfully");
      if (queueType === "wishlist") {
        dispatch(setQueue([...wishlist, response]));
      }
    }

    if (error) {
      toast.error(error.message);
    }
  };

  const onDeleteSongFromWishlist = async (songId) => {
    setOnAddSongToWishlistRequest(true);

    const { response, error } = await wishlistApi.deleteSong({ songId });

    setOnAddSongToWishlistRequest(false);

    if (response) {
      const newWishlist = wishlist.filter((s) => s.id !== songId);
      dispatch(setWishlist([...newWishlist]));
      toast.success("Removed song from wishlist successfully");
    }

    if (error) {
      toast.error(error.message);
    }
  };

  const totalPages = Math.ceil(songs.length / songsPerPage);

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          padding: 2,
        }}
      >
        {currentSongs.map((song, index) => (
          <Box
            key={index}
            sx={{
              visibility: song ? "visible" : "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "background.default",
              borderRadius: 2,
              overflow: "hidden",
              cursor: song ? "pointer" : "default",
              "&:hover": song ? { bgcolor: "grey.300" } : {},
              boxShadow: song ? 1 : 0,
              px: 1,
              py: 1,
            }}
          >
            {song && (
              <>
                <Box
                  component="img"
                  src={song.imageUrl || song.cover}
                  alt={song.title}
                  sx={{
                    width: { xs: 80, sm: 60, md: 60 },
                    height: { xs: 80, sm: 60, md: 60 },
                    objectFit: "cover",
                    flexShrink: 0,
                    borderRadius: 1,
                  }}
                />
                <Box sx={{ flexGrow: 1, px: 2, overflow: "hidden" }}>
                  <Marquee
                    pauseOnHover={true}
                    speed={50}
                    play={isPlaying && currentSong.id === song.id}
                  >
                    <Typography variant="subtitle2" noWrap fontWeight="bold">
                      {song.title}
                    </Typography>
                  </Marquee>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {song.artist}
                  </Typography>
                  <Box
                    sx={{
                      display: {
                        xs: "flex",
                        sm: "flex",
                        md: "flex",
                        lg: "none",
                      },
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
                    <IconButton
                      color="primary"
                      size="small"
                      sx={{ pr: 1 }}
                      onClick={() => dispatch(togglePlay())}
                    >
                      {isPlaying && currentSong.id === song.id ? (
                        <Pause />
                      ) : (
                        <PlayArrow />
                      )}
                    </IconButton>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: { xs: "none", sm: "none", md: "none", lg: "flex" },
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
              </>
            )}
          </Box>
        ))}
      </Box>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default ForYouSongList;
