import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Tabs,
  Tab,
} from "@mui/material";
import SearchSongList from "../components/SearchSongList";
import SearchSongListSkeleton from "../components/skeletons/SearchSongListSkeleton";
import searchApi from "../api/modules/search.api";
import { toast } from "react-toastify";
import PlaylistPopup from "../components/PlaylistPopup";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "@mui/icons-material";
import GridAlbumList from "../components/GridAlbumList";
import GridArtistList from "../components/GridArtistList";

const EmptySearch = ({ query }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="35vh"
        pt={9}
      >
        <img
          src="/musicWaveIcon.png"
          alt="nhaccuatoi"
          width="100"
          style={{ maxWidth: "100%" }}
        />
        <Typography
          mt={1}
          fontSize={{ xs: "1.0rem", md: "1.7rem" }}
          fontWeight={700}
          textAlign="center"
          sx={{
            background: "linear-gradient(90deg, #4ADE80, #14B8A6, #3B82F6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
          }}
        >
          {!query
            ? t("responseError.Hey what you want huh ?")
            : t("responseError.Song not founded")}
        </Typography>
      </Box>
    </motion.div>
  );
};

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [onSearch, setOnSearch] = useState(false);
  const { t } = useTranslation();

  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaylistPopupOpen, setIsPlaylistPopupOpen] = useState(false);

  const [tab, setTab] = useState(0);

  const handleChangeTab = (event, newValue) => setTab(newValue);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(debounceQuery), 2000);

    return () => clearTimeout(timer);
  }, [debounceQuery]);

  useEffect(() => {
    if (query.trim() === "") {
      setSongs([]);
      return;
    }

    let timer = null;

    const searchSong = async () => {
      setOnSearch(true);

      const { response, error } = await searchApi.searchAllTypes({
        keyword: query,
      });

      console.log("searchResult: ", response);

      if (response) {
        setSongs(response.searchResult.Songs);
        setAlbums(response.searchResult.Albums);
        setArtists(response.searchResult.Artists);
      }

      if (error) {
        toast.error(error.message);
      }

      timer = setTimeout(() => setOnSearch(false), 2000);
    };

    searchSong();

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <Box sx={{ py: 1, px: { xs: 1, md: 2 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          height: { xs: "69vh", sm: "59vh", md: "71vh" },
          maxWidth: { xs: "100%", md: "90%" },
          margin: "auto",
        }}
      >
        <TextField
          sx={{ maxWidth: "100%", margin: "0 auto" }}
          color="success"
          placeholder={t("formField.searchInput")}
          fullWidth
          autoFocus
          value={debounceQuery}
          onChange={(e) => setDebounceQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Tabs
          value={tab}
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mt: 1,
          }}
        >
          <Tab label={t("search.all")} />
          <Tab label={t("search.song")} />
          <Tab label={t("search.album")} />
          <Tab label={t("search.artist")} />
        </Tabs>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            mb: { xs: 3, sm: 0 },
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <AnimatePresence mode="wait">
            {onSearch ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SearchSongListSkeleton
                  count={{ xs: 2, sm: 2, md: 6, lg: 7 }}
                />
              </motion.div>
            ) : query === "" ? (
              <EmptySearch key="empty" query={query} />
            ) : (
              <motion.div
                key={tab}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {tab === 0 && (
                  <>
                    <Box sx={{ py: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 0 }}
                        textTransform="uppercase"
                      >
                        {t("search.song")}
                      </Typography>
                      <SearchSongList
                        searchSongs={[...songs.slice(0, 5)]}
                        setSelectedSong={setSelectedSong}
                        setIsPlaylistPopupOpen={setIsPlaylistPopupOpen}
                      />
                    </Box>

                    <Box sx={{ py: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 0 }}
                        textTransform="uppercase"
                      >
                        {t("search.album")}
                      </Typography>
                      <GridAlbumList albums={albums} />
                    </Box>

                    <Box sx={{ py: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 0 }}
                        textTransform="uppercase"
                      >
                        {t("search.artist")}
                      </Typography>
                      <GridArtistList artists={artists} />
                    </Box>
                  </>
                )}

                {tab === 1 && (
                  <Box sx={{ py: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 0 }}
                      textTransform="uppercase"
                    >
                      {t("search.song")}
                    </Typography>
                    <SearchSongList
                      searchSongs={songs}
                      setSelectedSong={setSelectedSong}
                      setIsPlaylistPopupOpen={setIsPlaylistPopupOpen}
                    />
                  </Box>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>

      <PlaylistPopup
        isPlaylistPopupOpen={isPlaylistPopupOpen}
        setIsPlaylistPopupOpen={setIsPlaylistPopupOpen}
        selectedSong={selectedSong}
      />
    </Box>
  );
};

export default SearchPage;
