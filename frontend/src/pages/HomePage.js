import { Box, Typography } from "@mui/material";
import ForYouSongList from "../features/Song/components/ForYouSongList";
import GridSongList from "../features/Song/components/GridSongList";
import { useState, useEffect } from "react";
import songApi from "../features/Song/api/song.api";
import { toast } from "react-toastify";
import GridSongListSkeleton from "../features/Song/components/skeletons/GridSongListSkeleton";
import PaginationBar from "../components/PaginationBar";
import PlaylistPopup from "../features/Playlist/components/PlaylistPopup";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isPlaylistPopupOpen, setIsPlaylistPopupOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTrendingSongs = async () => {
      setIsLoading(true);

      const { response, error } = await songApi.getTrendingSongs();

      setIsLoading(false);

      if (response) {
        setTrendingSongs(response);
      }

      if (error) {
        toast.error(error.message);
      }
    };

    fetchTrendingSongs();
  }, []);

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }} textTransform="uppercase">
          {t("homePage.forYou")}
        </Typography>

        <Box>
          <ForYouSongList
            currentPage={currentPage}
            setSelectedSong={setSelectedSong}
            setIsPlaylistPopupOpen={setIsPlaylistPopupOpen}
          />
          <PaginationBar setCurrentPage={setCurrentPage} />
        </Box>
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
