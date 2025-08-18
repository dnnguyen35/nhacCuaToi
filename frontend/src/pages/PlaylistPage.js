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
  CircularProgress,
  Checkbox,
  Tooltip,
  Pagination,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  AccessTime,
  DeleteForever,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  playPlaylist,
  togglePlay,
  deleteSongFromQueue,
  deleteMultipleSongsFromQueue,
} from "../redux/slices/playerSlice";
import playlistApi from "../api/modules/playlist.api";
import { setPlaylist } from "../redux/slices/userSlice";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import PageNotFound from "../components/PageNotFound";
import { formatDurationToHMS } from "../utils/formatDurationToHMS";
import { motion } from "framer-motion";
import { rowOnEachPage } from "../configs/pagination.configs";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const { playlist } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [onDeleteSongRequest, setOnDeleteSongRequest] = useState(false);
  const [invalidPlaylistId, setInvalidPlaylistId] = useState(false);
  const { themeMode } = useSelector((state) => state.themeMode);

  const { t } = useTranslation();

  const { currentSong, isPlaying, queue, queueType } = useSelector(
    (state) => state.player
  );
  const dispatch = useDispatch();

  const [multipleSelectMode, setMultipleSelectMode] = useState(false);
  const [deletedSongListId, setDeletedSongListId] = useState([]);

  const rowPerPage = rowOnEachPage.wishlistTable;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayPlaylist, setDisplayPlaylist] = useState([]);

  useEffect(() => {
    const fetchPlaylist = async () => {
      setIsLoading(true);

      const { response, error } = await playlistApi.getAllSongsOfPlaylist({
        playlistId,
      });

      setIsLoading(false);

      if (response) {
        setInvalidPlaylistId(false);
        setCurrentPlaylist(response);
        setCurrentPage(1);
        setDeletedSongListId([]);
        setMultipleSelectMode(false);
      }

      if (error) {
        setInvalidPlaylistId(true);
        toast.error(t(`responseError.${error.message}`));
      }
    };

    if (playlistId) {
      fetchPlaylist();
    }
  }, [playlistId]);

  useEffect(() => {
    const newTotalPages =
      Math.ceil(currentPlaylist?.Songs?.length / rowPerPage) || 0;
    setTotalPages(newTotalPages);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }

    const startIndex = (currentPage - 1) * rowPerPage;

    const displayList =
      currentPlaylist?.Songs.slice(startIndex, startIndex + rowPerPage) || [];
    setDisplayPlaylist(displayList);
  }, [currentPage, currentPlaylist]);

  const onSongCheckedClick = (songId) => {
    setDeletedSongListId((prev) =>
      prev.some((sId) => sId === songId)
        ? prev.filter((sId) => sId !== songId)
        : [...prev, songId]
    );
  };

  const onSelectedAllSong = () => {
    if (deletedSongListId.length === currentPlaylist?.Songs?.length) {
      setDeletedSongListId([]);
      setMultipleSelectMode(false);
    } else {
      setDeletedSongListId(currentPlaylist?.Songs?.map((s) => s.id));
      setMultipleSelectMode(true);
    }
  };

  const handleDeletedMultipleSong = async () => {
    if (onDeleteSongRequest) return;

    if (deletedSongListId.length < 1) return;

    const confirm = await Swal.fire({
      title: t("sweetalert.Are you sure?"),
      text: `${t("sweetalert.Do you really want to delete")}${t(
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

    const { response, error } = await playlistApi.deleteMultipleSong({
      playlistId: currentPlaylist?.id,
      deletedSongListId,
    });

    setOnDeleteSongRequest(false);

    if (response) {
      toast.success(
        t("responseSuccess.Removed song from playlist successfully")
      );
      const isCurrentPlaylistPlaying = currentPlaylist?.Songs?.some(
        (song) => song.id === currentSong?.id
      );

      if (
        isCurrentPlaylistPlaying &&
        queue.length > 0 &&
        currentPlaylist?.id === playlist?.id &&
        queueType === "playlist"
      ) {
        dispatch(deleteMultipleSongsFromQueue(deletedSongListId));
      }

      const newPlaylistSongs = currentPlaylist?.Songs.filter(
        (s) => !deletedSongListId.includes(s.id)
      );

      if (currentPlaylist?.id === playlist?.id)
        dispatch(setPlaylist({ ...currentPlaylist, Songs: newPlaylistSongs }));

      setCurrentPlaylist({ ...currentPlaylist, Songs: newPlaylistSongs });
      setDeletedSongListId([]);
      setMultipleSelectMode(false);
    }

    if (error) {
      toast.error(t(`responseError.${error.message}`));
    }
  };

  const handlePlayPlaylist = () => {
    if (!currentPlaylist) return;

    const isCurrentPlaylistPlaying = currentPlaylist?.Songs?.some(
      (song) => song.id === currentSong?.id
    );

    if (
      isCurrentPlaylistPlaying &&
      currentPlaylist.id === playlist.id &&
      queueType === "playlist"
    ) {
      dispatch(togglePlay());
    } else {
      const songs = currentPlaylist?.Songs;
      const startIndex = 0;
      dispatch(playPlaylist({ songs, startIndex }));
      dispatch(setPlaylist(currentPlaylist));
    }
  };

  const handlePlaySong = (playSong) => {
    if (!currentPlaylist) return;

    const songs = currentPlaylist?.Songs;
    const startIndex = currentPlaylist?.Songs.findIndex(
      (s) => s.id === playSong.id
    );
    dispatch(playPlaylist({ songs, startIndex }));
    dispatch(setPlaylist(currentPlaylist));
  };

  const onDeleteSongFromPlaylistClick = async (deleteSong) => {
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

    const { response, error } = await playlistApi.deleteSongFromPlaylist({
      playlistId: currentPlaylist.id,
      songId: deleteSong.id,
    });

    setOnDeleteSongRequest(false);

    if (response) {
      toast.success(
        t("responseSuccess.Removed song from playlist successfully")
      );
      const isCurrentPlaylistPlaying = currentPlaylist?.Songs.some(
        (song) => song.id === currentSong?.id
      );

      if (
        isCurrentPlaylistPlaying &&
        queue.length > 0 &&
        currentPlaylist?.id === playlist?.id &&
        queueType === "playlist"
      ) {
        dispatch(deleteSongFromQueue(deleteSong));
      }

      const newPlaylistSongs = currentPlaylist?.Songs.filter(
        (s) => s.id !== deleteSong.id
      );

      if (currentPlaylist?.id === playlist?.id)
        dispatch(setPlaylist({ ...currentPlaylist, Songs: newPlaylistSongs }));

      setCurrentPlaylist({ ...currentPlaylist, Songs: newPlaylistSongs });
    }

    if (error) {
      toast.error(t(`responseError.${error.message}`));
    }
  };

  if (invalidPlaylistId) return <PageNotFound />;

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
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <Box
              component="img"
              src={
                currentPlaylist?.Songs.length > 0
                  ? currentPlaylist?.Songs[0]?.imageUrl
                  : "/noDataFound.webp"
              }
              alt={
                currentPlaylist?.Songs.length > 0
                  ? currentPlaylist?.name
                  : "nhaccuatoi"
              }
              sx={{
                width: 240,
                height: 240,
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
                Playlist
              </Typography>
              <Typography
                sx={{
                  fontSize: {
                    xs: "1.5rem",
                    sm: "3rem",
                    md: "5rem",
                  },
                  fontWeight: "bold",
                }}
                fontWeight="bold"
                marginY={2}
              >
                {currentPlaylist?.name}
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                color="text.secondary"
              >
                <Typography>{currentPlaylist?.Songs?.length}</Typography>
                <Typography textTransform="uppercase">
                  ~ {t("songs")}
                </Typography>
                <Typography>
                  ~{" "}
                  {formatDurationToHMS(
                    currentPlaylist?.Songs?.reduce(
                      (acc, cur) => acc + cur.duration,
                      0
                    )
                  )}
                </Typography>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                gap={1}
                color="text.secondary"
              >
                {currentPlaylist?.Songs?.length > 0 && (
                  <Tooltip title="Multiple select" arrow placement="bottom">
                    <Checkbox
                      indeterminate={
                        deletedSongListId.length > 0 &&
                        deletedSongListId.length <
                          currentPlaylist?.Songs?.length
                      }
                      checked={
                        deletedSongListId.length ===
                        currentPlaylist?.Songs?.length
                      }
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
              onClick={handlePlayPlaylist}
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
              currentPlaylist?.id === playlist?.id &&
              queueType === "playlist" &&
              currentPlaylist?.Songs?.some(
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
          >
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: { xs: 300, md: 500 },
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
                <TableHead>
                  <TableRow>
                    {multipleSelectMode && (
                      <TableCell
                        align="center"
                        sx={{
                          color: "primary.main",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          width: 43,
                        }}
                      >
                        ...
                      </TableCell>
                    )}
                    <TableCell
                      align="center"
                      sx={{
                        color: "primary.main",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      #
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "primary.main",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {t("songTable.title")}
                    </TableCell>
                    <TableCell
                      sx={{
                        display: { xs: "none", sm: "table-cell" },
                        color: "primary.main",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {t("songTable.releasedDate")}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "primary.main",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      <AccessTime fontSize="small" />
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "primary.main",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {t("songTable.actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayPlaylist.length <= 0 ? (
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
                    displayPlaylist.map((song, index) => {
                      const isCurrentSong = currentSong?.id === song.id;
                      return (
                        <TableRow
                          key={song.id}
                          hover
                          sx={{
                            cursor: "pointer",
                            backgroundColor:
                              isCurrentSong && queueType === "playlist"
                                ? "primary.main"
                                : "inherit",
                          }}
                          onClick={() => handlePlaySong(song)}
                        >
                          {multipleSelectMode && (
                            <TableCell>
                              <Checkbox
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
                          <TableCell align="center" width={40}>
                            {isCurrentSong &&
                            currentPlaylist?.id === playlist?.id &&
                            isPlaying &&
                            queueType === "playlist" ? (
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
                            {song.createdAt.split("T")[0]}
                          </TableCell>
                          <TableCell>
                            {formatDurationToHMS(song.duration)}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              disabled={multipleSelectMode ? true : false}
                              onClick={(event) => {
                                event.stopPropagation();
                                onDeleteSongFromPlaylistClick(song);
                              }}
                              color={"error"}
                            >
                              <DeleteForever />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {currentPlaylist?.Songs?.length > 0 && (
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

export default PlaylistPage;
