import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { PlayArrow, Pause, List } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import Marquee from "react-fast-marquee";
import { togglePlay, playAlbum } from "../redux/slices/playerSlice";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { routesGen } from "../routes/routes";

const SearchAlbumTab = ({ searchAlbums }) => {
  const { t } = useTranslation();

  const { currentSong, isPlaying, queueType } = useSelector(
    (state) => state.player
  );

  const dispatch = useDispatch();

  const handlePlayAlbum = (albumId) => {
    const chooseAlbum = searchAlbums?.find((a) => a.id === albumId);

    const ischooseAlbumPlaying = chooseAlbum?.Songs.some(
      (s) => s.id === currentSong.id
    );

    if (
      ischooseAlbumPlaying &&
      chooseAlbum.id === Number(queueType.split(":")[1]) &&
      queueType.split(":")[0] === "album"
    ) {
      dispatch(togglePlay());
    } else {
      const songs = chooseAlbum?.Songs;
      const startIndex = 0;
      dispatch(playAlbum({ songs, startIndex, albumId }));
    }
  };

  return (
    <Box
      sx={{
        display: searchAlbums?.length > 0 ? "grid" : "flex",
        gap: 2,
        rowGap: 2,
        gridTemplateColumns: "repeat(auto-fill, minmax(178px, 1fr))",
        maxWidth: "100%",
        margin: "0 auto",
        justifyContent: "center",
        justifyItems: "center",
      }}
    >
      {searchAlbums?.length <= 0 ? (
        <Typography
          textAlign="center"
          sx={{ color: "primary.main", fontWeight: "bold", mt: 2 }}
        >
          {t("responseError.Album not founded")}
        </Typography>
      ) : (
        searchAlbums.map((album) => (
          <Card
            sx={{
              width: 178,
              height: 270,
              flexShrink: 0,
              px: 1,
              py: 1,
              borderRadius: 2,
            }}
          >
            <CardMedia
              component="img"
              height="162"
              image={album.imageUrl || "/noDataFound.webp"}
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
                album.id === Number(queueType.split(":")[1]) &&
                queueType.split(":")[0] === "album" &&
                album?.Songs?.some((song) => song.id === currentSong?.id) ? (
                  <Marquee pauseOnHover={false} speed={50} play={true}>
                    <Typography variant="body1" fontWeight="bold" noWrap>
                      {`${album.title}\u00A0\u00A0\u00A0`}
                    </Typography>
                  </Marquee>
                ) : (
                  <Tooltip title={album.title} arrow placement="top">
                    <Typography variant="body1" fontWeight="bold" noWrap>
                      {`${album.title}\u00A0\u00A0\u00A0`}
                    </Typography>
                  </Tooltip>
                )}
                <Typography variant="body2" color="text.secondary" noWrap>
                  {album.artist}
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
                  to={routesGen.album(album.id)}
                >
                  <List />
                </IconButton>

                <IconButton
                  color="primary"
                  size="small"
                  sx={{ pr: 1 }}
                  onClick={() => {
                    handlePlayAlbum(album.id);
                  }}
                >
                  {isPlaying &&
                  album.id === Number(queueType.split(":")[1]) &&
                  queueType.split(":")[0] === "album" &&
                  album?.Songs?.some((song) => song.id === currentSong?.id) ? (
                    <Pause />
                  ) : (
                    <PlayArrow />
                  )}
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default SearchAlbumTab;
