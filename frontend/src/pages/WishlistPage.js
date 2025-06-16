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
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  AccessTime,
  DeleteForever,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { formatDuration } from "../utils/formatDuration";
import {
  deleteSongFromQueue,
  playWishlist,
  togglePlay,
} from "../redux/slices/playerSlice";
import { setWishlist, setPlaylist } from "../redux/slices/userSlice";
import { useState } from "react";
import wishlistApi from "../api/modules/wishlist.api";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const WishlistPage = () => {
  const { wishlist } = useSelector((state) => state.user);
  const { currentSong, isPlaying, queue, queueType } = useSelector(
    (state) => state.player
  );
  const { themeMode } = useSelector((state) => state.themeMode);

  const [onDeleteSongRequest, setOnDeleteSongRequest] = useState(false);

  const dispatch = useDispatch();
  const { t } = useTranslation();

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

  const handlePlaySong = (index) => {
    if (!wishlist) return;

    const songs = wishlist;
    const startIndex = index;
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

  return (
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
              wishlist.length > 0 ? wishlist[0]?.imageUrl : "/ronaldo_siuuu.jpg"
            }
            alt={wishlist.length > 0 ? wishlist[0]?.title : "ronalo"}
            sx={{
              width: 240,
              height: 240,
              borderRadius: 1,
              boxShadow: 6,
              objectFit: "cover",
            }}
          />
          <Box display="flex" flexDirection="column" justifyContent="flex-end">
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
              <Typography textTransform="uppercase">~ {t("songs")}</Typography>
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

        <Box paddingX={3} flexGrow={1} sx={{ overflowY: "auto" }} paddingY={2}>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: { xs: 300, md: 300 },
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
                  <TableCell
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
                  wishlist.map((song, index) => {
                    const isCurrentSong = currentSong?.id === song.id;
                    return (
                      <TableRow
                        key={song.id}
                        hover
                        sx={{ cursor: "pointer" }}
                        onClick={() => handlePlaySong(index)}
                      >
                        <TableCell align="center" width={40}>
                          {isCurrentSong &&
                          isPlaying &&
                          queueType === "wishlist" ? (
                            <Typography color="success">♫</Typography>
                          ) : (
                            <Typography>{index + 1}</Typography>
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
                        <TableCell>{formatDuration(song.duration)}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation();
                              onDeleteSongFromWishlistClick(song);
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
        </Box>
      </Box>
    </Box>
  );
};

export default WishlistPage;
