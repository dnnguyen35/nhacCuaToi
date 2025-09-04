import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  IconButton,
  Checkbox,
  Tooltip,
  Pagination,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  AccessTime,
  DeleteForever,
  Favorite,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteSongFromQueue,
  playWishlist,
  togglePlay,
  deleteMultipleSongsFromQueue,
} from "../redux/slices/playerSlice";
import { setWishlist, setPlaylist } from "../redux/slices/userSlice";
import { useState } from "react";
import wishlistApi from "../api/modules/wishlist.api";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { formatDurationToHMS } from "../utils/formatDurationToHMS";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { rowOnEachPage } from "../configs/pagination.configs";

const WishlistPage = () => {
  const { wishlist } = useSelector((state) => state.user);
  const { currentSong, isPlaying, queue, queueType } = useSelector(
    (state) => state.player
  );
  const { themeMode } = useSelector((state) => state.themeMode);

  const [onDeleteSongRequest, setOnDeleteSongRequest] = useState(false);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [multipleSelectMode, setMultipleSelectMode] = useState(false);
  const [deletedSongListId, setDeletedSongListId] = useState([]);

  const rowPerPage = rowOnEachPage.wishlistTable;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayWishlist, setDisplayWishlist] = useState([]);

  const onSongCheckedClick = (songId) => {
    setDeletedSongListId((prev) =>
      prev.some((sId) => sId === songId)
        ? prev.filter((sId) => sId !== songId)
        : [...prev, songId]
    );
  };

  const onSelectedAllSong = () => {
    if (deletedSongListId.length === wishlist.length) {
      setDeletedSongListId([]);
      setMultipleSelectMode(false);
    } else {
      setDeletedSongListId(wishlist.map((s) => s.id));
      setMultipleSelectMode(true);
    }
  };

  const handleDeletedMultipleSong = async () => {
    if (onDeleteSongRequest) return;

    if (deletedSongListId.length < 1) return;

    const confirm = await Swal.fire({
      title: t("sweetalert.Are you sure?"),
      text: `${t("sweetalert.Do you really want to delete all.")}${t(
        "sweetalert.? This action cannot be undone."
      )}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("sweetalert.Yes, delete it!"),
      cancelButtonText: t("sweetalert.Cancel"),
      theme: themeMode,
    });

    if (!confirm.isConfirmed) return;

    setOnDeleteSongRequest(true);

    const { response, error } = await wishlistApi.deleteMultipleSong({
      deletedSongListId,
    });

    setOnDeleteSongRequest(false);

    if (response) {
      const isCurrentWishlistPlaying = wishlist.some(
        (song) => song.id === currentSong?.id
      );

      if (
        isCurrentWishlistPlaying &&
        queue.length > 0 &&
        queueType === "wishlist"
      ) {
        dispatch(deleteMultipleSongsFromQueue(deletedSongListId));
      }

      toast.success(
        t("responseSuccess.Removed song from wishlist successfully")
      );

      const newWishlist = wishlist.filter(
        (s) => !deletedSongListId.includes(s.id)
      );
      dispatch(setWishlist(newWishlist));

      setDeletedSongListId([]);
      setMultipleSelectMode(false);
    }

    if (error) {
      toast.error(t(`responseError.${error.message}`));
    }
  };

  const handlePlayWishlist = () => {
    if (!wishlist) return;

    const isCurrentWishlistPlaying = wishlist.some(
      (song) => song.id === currentSong?.id
    );

    if (isCurrentWishlistPlaying && queueType === "wishlist") {
      dispatch(togglePlay());
    } else {
      const songs = wishlist;
      const startIndex = 0;
      dispatch(playWishlist({ songs, startIndex }));
      dispatch(setPlaylist({ id: -1, isNull: true }));
    }
  };

  const handlePlaySong = (playSong) => {
    if (!wishlist) return;

    const songs = wishlist;
    const startIndex = wishlist.findIndex((s) => s.id === playSong.id);
    dispatch(playWishlist({ songs, startIndex }));
    dispatch(setPlaylist({ id: -1, isNull: true }));
  };

  const onDeleteSongFromWishlistClick = async (deleteSong) => {
    if (onDeleteSongRequest) return;

    const confirm = await Swal.fire({
      title: t("sweetalert.Are you sure?"),
      text: `${t("sweetalert.Do you really want to delete")} "${
        deleteSong.title
      }"${t("sweetalert.? This action cannot be undone.")}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("sweetalert.Yes, delete it!"),
      cancelButtonText: t("sweetalert.Cancel"),
      theme: themeMode,
    });

    if (!confirm.isConfirmed) return;

    setOnDeleteSongRequest(true);

    const { response, error } = await wishlistApi.deleteSong({
      songId: deleteSong.id,
    });

    setOnDeleteSongRequest(false);

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
        toast.success(
          t("responseSuccess.Removed song from wishlist successfully")
        );
      }

      const newWishlist = wishlist.filter((s) => s.id !== deleteSong.id);
      dispatch(setWishlist(newWishlist));
    }

    if (error) {
      toast.error(t(`responseError.${error.message}`));
    }
  };

  useEffect(() => {
    const newTotalPages = Math.ceil(wishlist.length / rowPerPage);
    setTotalPages(newTotalPages);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }

    const startIndex = (currentPage - 1) * rowPerPage;

    const displayList =
      wishlist.slice(startIndex, startIndex + rowPerPage) || [];
    setDisplayWishlist(displayList);
  }, [currentPage, wishlist]);

  return (
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
            flexDirection={{ xs: "column", sm: "row" }}
            padding={3}
            gap={3}
          >
            <Box
              component="img"
              src={
                wishlist.length > 0
                  ? wishlist[0]?.imageUrl
                  : "/noDataFound.webp"
              }
              alt={wishlist.length > 0 ? wishlist[0]?.title : "nhaccuatoi"}
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
              <Typography variant="subtitle2" color="text.secondary">
                Wishlist
              </Typography>

              <Box
                display="flex"
                alignItems="center"
                gap={1}
                color="text.secondary"
              >
                <Typography>{wishlist?.length}</Typography>
                <Typography textTransform="uppercase">
                  ~ {t("songs")}
                </Typography>
                <Typography>
                  ~{" "}
                  {formatDurationToHMS(
                    wishlist?.reduce((acc, cur) => acc + cur.duration, 0)
                  )}
                </Typography>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                gap={1}
                color="text.secondary"
              >
                {wishlist.length > 0 && (
                  <Tooltip title="Multiple select" arrow placement="bottom">
                    <Checkbox
                      indeterminate={
                        deletedSongListId.length > 0 &&
                        deletedSongListId.length < wishlist.length
                      }
                      checked={deletedSongListId.length === wishlist.length}
                      onChange={onSelectedAllSong}
                    />
                  </Tooltip>
                )}

                {multipleSelectMode && deletedSongListId.length >= 1 && (
                  <Tooltip title="Delete all" arrow placement="bottom">
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeletedMultipleSong();
                      }}
                      color={"error"}
                    >
                      <DeleteForever />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>

          <Box paddingX={3} paddingBottom={2}>
            <Button
              onClick={handlePlayWishlist}
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
              queueType === "wishlist" &&
              wishlist?.some((song) => song.id === currentSong?.id) ? (
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
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: { xs: 300, md: 500 },
                maxWidth: { xs: "100%", md: "80%" },
                overflow: "auto",
                "&::-webkit-scrollbar": {
                  width: "6px",
                  height: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "primary.main",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Table stickyHeader>
                <TableBody>
                  {wishlist.length <= 0 ? (
                    <TableRow>
                      <TableCell
                        align="center"
                        colSpan={5}
                        sx={{ color: "primary.main", fontWeight: "bold" }}
                      >
                        {t("songTable.thereNoSong")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayWishlist.map((song, index) => {
                      const isCurrentSong = currentSong?.id === song.id;

                      return (
                        <TableRow
                          key={song.id}
                          hover
                          sx={{
                            cursor: "pointer",
                            backgroundColor:
                              isCurrentSong && queueType === "wishlist"
                                ? "primary.main"
                                : "inherit",
                          }}
                          onClick={() => handlePlaySong(song)}
                        >
                          {multipleSelectMode && (
                            <TableCell padding="checkbox">
                              <Checkbox
                                size="small"
                                checked={
                                  deletedSongListId.some(
                                    (sId) => sId === song.id
                                  )
                                    ? true
                                    : false
                                }
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onSongCheckedClick(song.id);
                                }}
                              />
                            </TableCell>
                          )}
                          <TableCell
                            align="center"
                            width={40}
                            sx={{ display: { xs: "none", md: "table-cell" } }}
                          >
                            {isCurrentSong &&
                            isPlaying &&
                            queueType === "wishlist" ? (
                              <Typography color="success">♫</Typography>
                            ) : (
                              <Typography>
                                {(currentPage - 1) * rowPerPage + index + 1}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar
                                src={song.imageUrl}
                                alt={song.title}
                                variant="rounded"
                                sx={{ width: 48, height: 48 }}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle1"
                                  color="text.primary"
                                >
                                  {song.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {song.artist}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{ display: { xs: "none", sm: "table-cell" } }}
                          >
                            {formatDurationToHMS(song.duration)}
                          </TableCell>
                          <TableCell padding="none">
                            <IconButton
                              size="small"
                              disabled={multipleSelectMode ? true : false}
                              onClick={(event) => {
                                event.stopPropagation();
                                onDeleteSongFromWishlistClick(song);
                              }}
                              sx={{ color: "primary.main" }}
                            >
                              <Favorite />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {wishlist.length > 0 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default WishlistPage;
