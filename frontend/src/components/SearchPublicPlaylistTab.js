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
import { playPlaylist } from "../redux/slices/playerSlice";
import { setPlaylist } from "../redux/slices/userSlice";

const SearchPublicPlaylistTab = ({ searchPublicPlaylists }) => {
  const { t } = useTranslation();

  const { currentSong, isPlaying, queueType } = useSelector(
    (state) => state.player
  );

  const { playlist } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handlePlayPlaylist = (playlistId) => {
    const choosePlaylist = searchPublicPlaylists?.find(
      (pl) => pl?.id === playlistId
    );

    const ischoosePlaylistPlaying = choosePlaylist?.Songs?.some(
      (s) => s?.id === currentSong?.id
    );

    if (
      ischoosePlaylistPlaying &&
      choosePlaylist?.id === playlist?.id &&
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
        display: searchPublicPlaylists?.length > 0 ? "grid" : "flex",
        gap: 2,
        rowGap: 2,
        gridTemplateColumns: "repeat(auto-fill, minmax(178px, 1fr))",
        maxWidth: "100%",
        margin: "0 auto",
        justifyContent: "center",
        justifyItems: "center",
      }}
    >
      {searchPublicPlaylists?.length <= 0 ? (
        <Typography
          textAlign="center"
          sx={{ color: "primary.main", fontWeight: "bold", mt: 2 }}
        >
          {t("responseError.Playlists not founded")}
        </Typography>
      ) : (
        searchPublicPlaylists.map((pl) => (
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
                pl?.id === playlist?.id &&
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
                    handlePlayPlaylist(pl?.id);
                  }}
                >
                  {isPlaying &&
                  pl?.id === playlist?.id &&
                  queueType === "playlist" &&
                  pl?.Songs?.some((song) => song?.id === currentSong?.id) ? (
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

export default SearchPublicPlaylistTab;
