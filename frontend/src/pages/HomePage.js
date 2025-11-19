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
import albumApi from "../api/modules/album.api";
import GridAlbumList from "../components/GridAlbumList";
import playlistApi from "../api/modules/playlist.api";
import GridPublicPlaylistList from "../components/GridPublicPlaylistList";

const HomePage = () => {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isPlaylistPopupOpen, setIsPlaylistPopupOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);

  const [allArtists, setAllArtists] = useState([]);
  const [allArtistsLoading, setAllArtistsLoading] = useState(false);

  const [allAlbums, setAllAlbums] = useState([]);
  const [allAlbumsLoading, setAllAlbumsLoading] = useState(false);

  const [allPublicPlaylists, setAllPublicPlaylists] = useState([]);
  const [allPublicPlaylistsLoading, setAllPublicPlaylistsLoading] =
    useState(false);

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

      const fetchAllAlbums = async () => {
        setAllAlbumsLoading(true);

        const { response, error } = await albumApi.getAllAlbums();

        setAllAlbumsLoading(false);

        if (response) {
          setAllAlbums(response);
        }

        if (error) {
          toast.error(error.message);
        }
      };

      const fetchAllPublicPlaylists = async () => {
        setAllPublicPlaylistsLoading(true);

        const { response, error } = await playlistApi.getAllPublicPlaylists();

        setAllPublicPlaylistsLoading(false);

        if (response) {
          setAllPublicPlaylists(response);
        }

        if (error) {
          toast.error(error.message);
        }
      };

      await Promise.all([
        fetchTrendingSongs(),
        fetchAllArtists(),
        fetchAllAlbums(),
        fetchAllPublicPlaylists(),
      ]);
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
          {t("homePage.trendingAlbums")}
        </Typography>
        {allAlbumsLoading ? (
          <GridSongListSkeleton />
        ) : (
          <GridAlbumList albums={allAlbums} />
        )}
      </Box>

      <Box sx={{ px: { xs: 0, sm: 3 }, py: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }} textTransform="uppercase">
          {t("homePage.trendingArtists")}
        </Typography>
        {allArtistsLoading ? (
          <GridSongListSkeleton />
        ) : (
          <GridArtistList artists={allArtists} />
        )}
      </Box>

      <Box sx={{ px: { xs: 0, sm: 3 }, py: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }} textTransform="uppercase">
          {t("homePage.trendingPlaylists")}
        </Typography>
        {allAlbumsLoading ? (
          <GridSongListSkeleton />
        ) : (
          <GridPublicPlaylistList publicPlaylists={allPublicPlaylists} />
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
