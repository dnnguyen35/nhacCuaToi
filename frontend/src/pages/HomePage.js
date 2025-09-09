import { Box, Typography } from "@mui/material";
import ForYouSongList from "../components/ForYouSongList";
import GridSongList from "../components/GridSongList";
import { useState, useEffect } from "react";
import songApi from "../api/modules/song.api";
import { toast } from "react-toastify";
import GridSongListSkeleton from "../components/skeletons/GridSongListSkeleton";
import PaginationBar from "../components/PaginationBar";
import PlaylistPopup from "../components/PlaylistPopup";
import { useTranslation } from "react-i18next";
import GridArtistList from "../components/GridArtistList";
import artistApi from "../api/modules/artist.api";

const HomePage = () => {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isPlaylistPopupOpen, setIsPlaylistPopupOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);

  const [allArtists, setAllArtists] = useState([]);
  const [allArtistsLoading, setAllArtistsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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

      const fetchAllArtists = async () => {
        setAllArtistsLoading(true);

        const { response, error } = await artistApi.getAllArtists();

        setAllArtistsLoading(false);

        if (response) {
          setAllArtists(response);
        }

        if (error) {
          toast.error(error.message);
        }
      };
      await Promise.all([fetchTrendingSongs(), fetchAllArtists()]);
    };

    fetchData();
  }, []);

  return (
    <>
      <Box sx={{ px: { xs: 0, sm: 3 }, py: 3 }}>
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

      <Box sx={{ px: { xs: 0, sm: 3 }, py: 3 }}>
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

      <Box sx={{ px: { xs: 0, sm: 3 }, py: 3 }}>
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

      <Box sx={{ px: { xs: 0, sm: 3 }, py: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }} textTransform="uppercase">
          {t("homePage.highRating")}
        </Typography>
        {allArtistsLoading ? (
          <GridSongListSkeleton />
        ) : (
          <GridArtistList artists={allArtists} />
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
