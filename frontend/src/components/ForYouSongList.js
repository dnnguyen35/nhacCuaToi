import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  SwipeableDrawer,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  List,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  FavoriteBorderOutlined,
  Favorite,
  PlaylistAdd,
  MoreHoriz,
} from "@mui/icons-material";
import Marquee from "react-fast-marquee";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import songApi from "../api/modules/song.api";
import ForYouSongListSkeleton from "./skeletons/ForYouSongListSkeleton";
import { AnimatePresence, motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import { setAuthModalOpen } from "../redux/slices/authModalSlice";

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

const ForYouSongList = ({
  currentPage,
  setSelectedSong,
  setIsPlaylistPopupOpen,
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));

  const { user, wishlist } = useSelector((state) => state.user);
  const { isPlaying, currentSong, queueType, queue } = useSelector(
    (state) => state.player
  );

  const [isRerender, setIsRerender] = useState(0);

  const [songs, setSongs] = useState([]);

  const [onAddSongToWishlistRequest, setOnAddSongToWishlistRequest] =
    useState(false);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const [openSwipeableDrawer, setOpenSwipeableDrawer] = useState(false);
  const [isMoreVertClickedSong, setIsMoreVertClickedSong] = useState(null);

  const onAddSongToWishlistClick = async (song) => {
    if (onAddSongToWishlistRequest) return;

    if (wishlist.some((s) => s.id === song.id)) {
      onDeleteSongFromWishlist(song);
      return;
    }

    setOnAddSongToWishlistRequest(true);

    const { response, error } = await wishlistApi.addSong({ songId: song.id });

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

  useEffect(() => {
    const fetchAllSongs = async () => {
      const { response, error } = await songApi.getAllSongs({
        page: currentPage,
        limit: 6,
      });

      if (response) {
        setSongs(response.allSongs);
        setIsRerender((prev) => prev + 1);
      }

      if (error) {
        toast.error(t(`responseError.${error.message}`));
        setIsRerender((prev) => prev + 1);
      }
    };

    fetchAllSongs();
  }, [currentPage]);

  return isRerender === 0 ? (
    <ForYouSongListSkeleton />
  ) : (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              pX: { xs: 0, sm: 2 },
              pY: 2,
            }}
          >
            {songs.length > 0 &&
              songs.map((song, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    if (!song || !isXs || currentSong.id === song.id) return;

                    dispatch(initializeQueue([...songs]));
                    dispatch(setCurrentSong(song));
                  }}
                  sx={{
                    visibility: song ? "visible" : "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "background.default",
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: song ? "pointer" : "default",
                    boxShadow: song ? 1 : 0,
                    px: 1,
                    py: 1,
                    "@media (hover: hover) and (pointer: fine)": {
                      "&:hover": song ? { bgcolor: "grey.300" } : {},
                    },
                  }}
                >
                  {song && (
                    <>
                      <Box
                        component="img"
                        src={song.imageUrl || song.cover}
                        alt={song.title}
                        sx={{
                          width: { xs: 60, sm: 60, md: 60 },
                          height: { xs: 60, sm: 60, md: 60 },
                          objectFit: "cover",
                          flexShrink: 0,
                          borderRadius: 1,
                        }}
                      />
                      <Box sx={{ flexGrow: 1, px: 2, overflow: "hidden" }}>
                        {isPlaying && currentSong.id === song.id ? (
                          <Marquee pauseOnHover={false} speed={50} play={true}>
                            <Typography
                              variant="subtitle2"
                              noWrap
                              fontWeight="bold"
                            >
                              {`${song.title}\u00A0\u00A0\u00A0`}
                            </Typography>
                          </Marquee>
                        ) : (
                          <Typography
                            variant="subtitle2"
                            noWrap
                            fontWeight="bold"
                          >
                            {`${song.title}\u00A0\u00A0\u00A0`}
                          </Typography>
                        )}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {song.artist}
                        </Typography>
                        <Box
                          sx={{
                            display: {
                              xs: "none",
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
                                onClick={(e) => {
                                  e.stopPropagation();

                                  onAddSongToWishlistClick(song);
                                }}
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
                                onClick={(e) => {
                                  e.stopPropagation();

                                  setSelectedSong(song);
                                  setIsPlaylistPopupOpen(true);
                                }}
                              >
                                <PlaylistAdd />
                              </IconButton>
                            </>
                          )}
                          {currentSong.id === song.id ? (
                            <IconButton
                              color="primary"
                              size="small"
                              sx={{ pr: 1 }}
                              onClick={(e) => {
                                e.stopPropagation();

                                dispatch(togglePlay());
                              }}
                            >
                              {isPlaying ? <Pause /> : <PlayArrow />}
                            </IconButton>
                          ) : (
                            <IconButton
                              color="primary"
                              size="small"
                              sx={{ pr: 1 }}
                              onClick={(e) => {
                                e.stopPropagation();

                                dispatch(initializeQueue([...songs]));
                                dispatch(setCurrentSong(song));
                              }}
                            >
                              <PlayArrow />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: {
                            xs: "none",
                            sm: "none",
                            md: "none",
                            lg: "flex",
                          },
                        }}
                      >
                        {user && (
                          <>
                            <IconButton
                              color="primary"
                              size="small"
                              sx={{ pr: 1 }}
                              onClick={(e) => {
                                e.stopPropagation();

                                onAddSongToWishlistClick(song);
                              }}
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
                              onClick={(e) => {
                                e.stopPropagation();

                                setSelectedSong(song);
                                setIsPlaylistPopupOpen(true);
                              }}
                            >
                              <PlaylistAdd />
                            </IconButton>
                          </>
                        )}
                        {currentSong.id === song.id ? (
                          <IconButton
                            color="primary"
                            size="small"
                            sx={{ pr: 1 }}
                            onClick={(e) => {
                              e.stopPropagation();

                              dispatch(togglePlay());
                            }}
                          >
                            {isPlaying ? <Pause /> : <PlayArrow />}
                          </IconButton>
                        ) : (
                          <IconButton
                            color="primary"
                            size="small"
                            sx={{ pr: 1 }}
                            onClick={(e) => {
                              e.stopPropagation();

                              dispatch(initializeQueue([...songs]));
                              dispatch(setCurrentSong(song));
                            }}
                          >
                            <PlayArrow />
                          </IconButton>
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: {
                            xs: "flex",
                            sm: "none",
                            md: "none",
                            lg: "none",
                          },
                        }}
                      >
                        <IconButton
                          color="primary"
                          size="small"
                          sx={{ pr: 1 }}
                          onClick={(e) => {
                            e.stopPropagation();

                            if (!user) {
                              dispatch(setAuthModalOpen(true));
                              return;
                            }

                            setIsMoreVertClickedSong(song);
                            setOpenSwipeableDrawer(true);
                          }}
                        >
                          <MoreHoriz />
                        </IconButton>
                      </Box>
                    </>
                  )}
                </Box>
              ))}
          </Box>
        </motion.div>
      </AnimatePresence>

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
            marginTop: 2,
          }}
        >
          <ListItem divider>
            <ListItemAvatar sx={{ width: 70 }}>
              <Avatar
                variant="rounded"
                src={isMoreVertClickedSong?.imageUrl}
                sx={{ width: 60, height: 60 }}
              ></Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={isMoreVertClickedSong?.title}
              secondary={isMoreVertClickedSong?.artist}
              primaryTypographyProps={{
                noWrap: true,
                fontWeight: "bold",
              }}
              secondaryTypographyProps={{
                noWrap: true,
              }}
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
              justifyItems: "center",
            }}
          >
            <List
              sx={{
                width: "90%",
              }}
            >
              <ListItem
                button
                onClick={(e) => {
                  e.stopPropagation();

                  onAddSongToWishlistClick(isMoreVertClickedSong);
                }}
                divider
              >
                <ListItemAvatar sx={{ width: 70 }}>
                  <IconButton color="primary" size="small" sx={{ pr: 1 }}>
                    {wishlist.some(
                      (s) => s.id === isMoreVertClickedSong?.id
                    ) ? (
                      <Favorite />
                    ) : (
                      <FavoriteBorderOutlined />
                    )}
                  </IconButton>
                </ListItemAvatar>

                <ListItemText
                  primary={t("menu.wishlist")}
                  primaryTypographyProps={{
                    noWrap: true,
                    fontWeight: "bold",
                  }}
                />
              </ListItem>

              <ListItem
                button
                onClick={(e) => {
                  e.stopPropagation();

                  setOpenSwipeableDrawer(false);
                  setSelectedSong(isMoreVertClickedSong);
                  setIsPlaylistPopupOpen(true);
                }}
                divider
              >
                <ListItemAvatar sx={{ width: 70 }}>
                  <IconButton color="primary" size="small" sx={{ pr: 1 }}>
                    <PlaylistAdd />
                  </IconButton>
                </ListItemAvatar>

                <ListItemText
                  primary={t("userMenu.addSongIntoPlaylist")}
                  primaryTypographyProps={{
                    noWrap: true,
                    fontWeight: "bold",
                  }}
                />
              </ListItem>
            </List>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default ForYouSongList;
