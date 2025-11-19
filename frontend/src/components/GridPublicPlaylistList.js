import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PlayArrow, Pause, List } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import Marquee from "react-fast-marquee";
import { togglePlay, playAlbum } from "../redux/slices/playerSlice";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { routesGen } from "../routes/routes";
import { playPlaylist } from "../redux/slices/playerSlice";
import { setPlaylist } from "../redux/slices/userSlice";

const GridPublicPlaylistList = ({ publicPlaylists }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));

  const isHavePointer = useMediaQuery("(pointer: fine)");
  const { t } = useTranslation();

  const { currentSong, isPlaying, queueType } = useSelector(
    (state) => state.player
  );

  const { playlist } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handlePlayPlaylist = (playlistId) => {
    const choosePlaylist = publicPlaylists?.find((pl) => pl.id === playlistId);

    const ischoosePlaylistPlaying = choosePlaylist?.Songs.some(
      (s) => s.id === currentSong.id
    );

    if (
      ischoosePlaylistPlaying &&
      choosePlaylist.id === playlist?.id &&
      queueType === "playlist"
    ) {
      dispatch(togglePlay());
    } else {
      const songs = choosePlaylist?.Songs;
      const startIndex = 0;
      dispatch(playPlaylist({ songs, startIndex }));
      dispatch(setPlaylist(choosePlaylist));
    }
  };

  return (
    <Box
      sx={{
        px: 2,
        py: 2,
      }}
    >
      {publicPlaylists?.length <= 0 ? (
        <Typography
          align="center"
          sx={{ color: "primary.main", fontWeight: "bold", mt: 2 }}
        >
          {t("responseError.Playlist not founded")}
        </Typography>
      ) : (
        <Swiper
          modules={[Navigation]}
          navigation={isHavePointer}
          grabCursor
          spaceBetween={40}
          slidesPerView="auto"
          style={{ marginBottom: "8px" }}
          loop
        >
          {publicPlaylists.map((pl) => (
            <SwiperSlide
              key={pl.id}
              style={{
                width: isXs ? "152px" : "170px",
                height: "auto",
                paddingBottom: "8px",
              }}
            >
              <Card
                sx={{
                  width: isXs ? 136 : 162,
                  height: isXs ? 240 : 250,
                  flexShrink: 0,
                  px: 1,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                <CardMedia
                  component="img"
                  height={isXs ? "136" : "162"}
                  image={pl?.Songs[0]?.imageUrl || "/noDataFound.webp"}
                  sx={{
                    borderRadius: 2,
                  }}
                />
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    {isPlaying &&
                    pl.id === playlist.id &&
                    queueType === "playlist" &&
                    pl?.Songs?.some((song) => song?.id === currentSong?.id) ? (
                      <Marquee pauseOnHover={false} speed={50} play={true}>
                        <Typography variant="body1" fontWeight="bold" noWrap>
                          {`${pl?.name}\u00A0\u00A0\u00A0`}
                        </Typography>
                      </Marquee>
                    ) : (
                      <Tooltip title={pl?.name} arrow placement="top">
                        <Typography variant="body1" fontWeight="bold" noWrap>
                          {`${pl?.name}\u00A0\u00A0\u00A0`}
                        </Typography>
                      </Tooltip>
                    )}
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {pl?.createdBy}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: { xs: "flex", sm: "flex", md: "flex" },
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      color="primary"
                      size="small"
                      sx={{ pr: 1 }}
                      component={Link}
                      to={routesGen.playlist(pl.id)}
                    >
                      <List />
                    </IconButton>

                    <IconButton
                      color="primary"
                      size="small"
                      sx={{ pr: 1 }}
                      onClick={() => {
                        handlePlayPlaylist(pl.id);
                      }}
                    >
                      {isPlaying &&
                      pl.id === playlist.id &&
                      queueType === "playlist" &&
                      playlist?.Songs?.some(
                        (song) => song?.id === currentSong?.id
                      ) ? (
                        <Pause />
                      ) : (
                        <PlayArrow />
                      )}
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Box>
  );
};

export default GridPublicPlaylistList;
