import { Box, Typography } from "@mui/material";
import ForYouSongList from "../components/ForYouSongList";
import GridSongList from "../components/GridSongList";
import { useState, useEffect } from "react";
import songApi from "../api/modules/song.api";
import { toast } from "react-toastify";
import ForYouSongListSkeleton from "../components/skeletons/ForYouSongListSkeleton";
import GridSongListSkeleton from "../components/skeletons/GridSongListSkeleton";

import PlaylistPopup from "../components/PlaylistPopup";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const [allSongs, setAllSongs] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isPlaylistPopupOpen, setIsPlaylistPopupOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);

      const [allSongsRes, trendingSongsRes] = await Promise.all([
        songApi.getAllSongs(),
        songApi.getTrendingSongs(),
      ]);

      setIsLoading(false);

      if (allSongsRes.response) {
        setAllSongs(allSongsRes.response);
      }

      if (trendingSongsRes.response) {
        setTrendingSongs(trendingSongsRes.response);
      }

      if (allSongsRes.error) {
        toast.error(allSongsRes.error.message);
      }

      if (trendingSongsRes.error) {
        toast.error(trendingSongsRes.error.message);
      }
    };

    fetchSongs();
  }, []);

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }} textTransform="uppercase">
          {t("homePage.forYou")}
        </Typography>
        {isLoading ? (
          <ForYouSongListSkeleton />
        ) : (
          <ForYouSongList
            songs={allSongs}
            setSelectedSong={setSelectedSong}
            setIsPlaylistPopupOpen={setIsPlaylistPopupOpen}
          />
        )}
      </Box>

      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }} textTransform="uppercase">
          {t("homePage.treanding")}
        </Typography>
        {isLoading ? (
          <GridSongListSkeleton />
        ) : (
          <GridSongList
            songs={trendingSongs}
            setSelectedSong={setSelectedSong}
            setIsPlaylistPopupOpen={setIsPlaylistPopupOpen}
          />
        )}
      </Box>

      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }} textTransform="uppercase">
          {t("homePage.highRating")}
        </Typography>
        {isLoading ? (
          <GridSongListSkeleton />
        ) : (
          <GridSongList
            songs={[...trendingSongs].reverse()}
            setSelectedSong={setSelectedSong}
            setIsPlaylistPopupOpen={setIsPlaylistPopupOpen}
          />
        )}
      </Box>

      <PlaylistPopup
        isPlaylistPopupOpen={isPlaylistPopupOpen}
        setIsPlaylistPopupOpen={setIsPlaylistPopupOpen}
        selectedSong={selectedSong}
      />
    </>
  );
};

export default HomePage;
