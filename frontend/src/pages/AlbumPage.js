import {
  Box,
  Button,
  SwipeableDrawer,
  Avatar,
  Typography,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  Favorite,
  FavoriteBorderOutlined,
  PlaylistAdd,
  MoreHoriz,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  playAlbum,
  togglePlay,
  setQueue,
  deleteSongFromQueue,
} from "../redux/slices/playerSlice";
import { setWishlist } from "../redux/slices/userSlice";
import albumApi from "../api/modules/album.api";
import wishlistApi from "../api/modules/wishlist.api";
import { useTranslation } from "react-i18next";
import { formatDurationToHMS } from "../utils/formatDurationToHMS";
import { motion } from "framer-motion";
import { rowOnEachPage } from "../configs/pagination.configs";
import Marquee from "react-fast-marquee";
import PageNotFound from "../components/PageNotFound";
import PlaylistPopup from "../components/PlaylistPopup";
import { setAuthModalOpen } from "../redux/slices/authModalSlice";
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

const AlbumPage = () => {
  const { albumId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [invalidAlbumId, setInvalidAlbumId] = useState(false);
  const { themeMode } = useSelector((state) => state.themeMode);

  const { t } = useTranslation();

  const [onAddSongToWishlistRequest, setOnAddSongToWishlistRequest] =
    useState(false);

  const { wishlist, user } = useSelector((state) => state.user);

  const { currentSong, isPlaying, queue, queueType } = useSelector(
    (state) => state.player
  );
  const dispatch = useDispatch();

  const rowPerPage = rowOnEachPage.wishlistTable;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayAlbum, setDisplayAlbum] = useState([]);

  const [openSwipeableDrawer, setOpenSwipeableDrawer] = useState(false);
  const [isMoreVertClickedSong, setIsMoreVertClickedSong] = useState(null);

  const [isPlaylistPopupOpen, setIsPlaylistPopupOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      setIsLoading(true);

      const { response, error } = await albumApi.getAllSongsOfAlbum({
        albumId,
      });

      setIsLoading(false);

      if (response) {
        setInvalidAlbumId(false);
        setCurrentAlbum(response);
        setCurrentPage(1);
      }

      if (error) {
        setInvalidAlbumId(true);
        toast.error(t(`responseError.${error.message}`));
      }
    };

    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

  useEffect(() => {
    const newTotalPages =
      Math.ceil(currentAlbum?.Songs?.length / rowPerPage) || 0;
    setTotalPages(newTotalPages);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }

    const startIndex = (currentPage - 1) * rowPerPage;

    const displayAlbum =
      currentAlbum?.Songs.slice(startIndex, startIndex + rowPerPage) || [];
    setDisplayAlbum(displayAlbum);
  }, [currentPage, currentAlbum]);

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPlaying = currentAlbum?.Songs?.some(
      (song) => song.id === currentSong?.id
    );

    if (
      isCurrentAlbumPlaying &&
      currentAlbum.id === Number(queueType.split(":")[1]) &&
      queueType.split(":")[0] === "album"
    ) {
      dispatch(togglePlay());
    } else {
      const songs = currentAlbum?.Songs;
      const startIndex = 0;
      dispatch(playAlbum({ songs, startIndex, albumId: currentAlbum?.id }));
    }
  };

  const handlePlaySong = (playSong) => {
    if (!currentAlbum) return;

    const songs = currentAlbum?.Songs;
    const startIndex = currentAlbum?.Songs.findIndex(
      (s) => s.id === playSong.id
    );
    dispatch(playAlbum({ songs, startIndex, albumId: currentAlbum?.id }));
  };

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

  if (invalidAlbumId) return <PageNotFound />;

  if (isLoading)
    return (
      <Box
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      >
        <Box position="relative">
          <Box
            position="absolute"
            inset={0}
            sx={{
              background:
                "linear-gradient(to bottom, rgba(80,56,160,0.8), rgba(33,33,33,0.8), rgba(33,33,33,0.8))",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          <Box
            position="relative"
            zIndex={1}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <Box
              display="flex"
              padding={3}
              gap={3}
              flexDirection={{ xs: "row", sm: "row" }}
            >
              <Box
                component="img"
                src={
                  currentAlbum?.Songs.length > 0
                    ? currentAlbum?.imageUrl
                    : "/noDataFound.webp"
                }
                alt={
                  currentAlbum?.Songs.length > 0
                    ? currentAlbum?.title
                    : "nhaccuatoi"
                }
                sx={{
                  width: { xs: 100, sm: 200 },
                  height: { xs: 100, sm: 200 },
                  borderRadius: 1,
                  boxShadow: 6,
                  objectFit: "cover",
                }}
              />
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
              >
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography color="text.secondary">Album</Typography>
                  <Typography fontWeight="bold" noWrap>
                    {currentAlbum?.title}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  color="text.secondary"
                >
                  <Box display="flex" flexDirection="row">
                    <Typography textTransform="uppercase">
                      {t("songs")}({currentAlbum?.Songs?.length || 0})
                    </Typography>
                    <Typography>
                      ~{" "}
                      {formatDurationToHMS(
                        currentAlbum?.Songs?.reduce(
                          (acc, cur) => acc + cur.duration,
                          0
                        )
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box paddingX={3} paddingBottom={2}>
              <Button
                onClick={handlePlayAlbum}
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.3s",
                  minWidth: "unset",
                  padding: 0,
                }}
              >
                {isPlaying &&
                currentAlbum?.id === Number(queueType.split(":")[1]) &&
                queueType.split(":")[0] === "album" &&
                currentAlbum?.Songs?.some(
                  (song) => song.id === currentSong?.id
                ) ? (
                  <Pause sx={{ color: "black", fontSize: 28 }} />
                ) : (
                  <PlayArrow sx={{ color: "black", fontSize: 28 }} />
                )}
              </Button>
            </Box>

            <Box
              paddingX={3}
              flexGrow={1}
              sx={{ overflowY: "auto" }}
              paddingY={2}
              display="flex"
              flexDirection="column"
              alignItems={"center"}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  width: { xs: "100%", md: "80%" },
                }}
              >
                {currentAlbum?.Songs?.length <= 0 ? (
                  <Typography
                    align="center"
                    sx={{ color: "primary.main", fontWeight: "bold", mt: 2 }}
                  >
                    {t("songTable.thereNoSong")}
                  </Typography>
                ) : (
                  currentAlbum?.Songs?.map((song, index) => {
                    const isCurrentSong = currentSong?.id === song.id;

                    return (
                      <Box
                        key={song.id}
                        onClick={() => handlePlaySong(song)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 1.2,
                          borderRadius: 2,
                          cursor: "pointer",
                          bgcolor:
                            isCurrentSong &&
                            queueType.split(":")[0] === "album" &&
                            currentAlbum?.id === Number(queueType.split(":")[1])
                              ? "background.default"
                              : "background.default",
                          "&:hover": {
                            bgcolor:
                              isCurrentSong &&
                              queueType.split(":")[0] === "album" &&
                              currentAlbum?.id ===
                                Number(queueType.split(":")[1])
                                ? "background.paper"
                                : "action.hover",
                          },
                          transition: "0.2s",
                        }}
                      >
                        <Avatar
                          src={song.imageUrl}
                          alt={song.title}
                          variant="rounded"
                          sx={{ width: 48, height: 48 }}
                        />

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          {isCurrentSong &&
                          queueType.split(":")[0] === "album" &&
                          isPlaying &&
                          currentAlbum?.id ===
                            Number(queueType.split(":")[1]) ? (
                            <Marquee
                              pauseOnHover={false}
                              speed={50}
                              play={true}
                            >
                              <Typography
                                variant="subtitle1"
                                color="text.primary"
                                noWrap
                              >
                                {`${song.title}\u00A0\u00A0\u00A0`}
                              </Typography>
                            </Marquee>
                          ) : (
                            <Typography
                              variant="subtitle1"
                              color="text.primary"
                              noWrap
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
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: { xs: "none", sm: "block" },
                            minWidth: 60,
                          }}
                        >
                          {formatDurationToHMS(song.duration)}
                        </Typography>

                        <IconButton
                          color="primary"
                          size="small"
                          sx={{
                            pr: 1,
                            display: { xs: "none", sm: "inline-flex" },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();

                            if (!user) {
                              dispatch(setAuthModalOpen(true));
                              return;
                            }

                            setSelectedSong(song);
                            setIsPlaylistPopupOpen(true);
                          }}
                        >
                          <PlaylistAdd />
                        </IconButton>

                        <IconButton
                          color="primary"
                          size="small"
                          sx={{
                            pr: 1,
                            display: { xs: "none", sm: "inline-flex" },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();

                            if (!user) {
                              dispatch(setAuthModalOpen(true));
                              return;
                            }

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
                          sx={{
                            pr: 1,
                            display: { xs: "inline-flex", sm: "none" },
                          }}
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
                    );
                  })
                )}
              </Box>

              {/* {currentAlbum?.Songs?.length > 0 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                />
              </Box>
            )} */}
            </Box>
          </Box>
        </Box>
      </motion.div>

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
          <ListItem>
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

      <PlaylistPopup
        isPlaylistPopupOpen={isPlaylistPopupOpen}
        setIsPlaylistPopupOpen={setIsPlaylistPopupOpen}
        selectedSong={selectedSong}
      />
    </>
  );
};

export default AlbumPage;
