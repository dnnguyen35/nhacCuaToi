import { useState, useEffect } from "react";
import { Box, Stack, TextField, Typography } from "@mui/material";
import SearchSongList from "../components/SearchSongList";
import SearchSongListSkeleton from "../components/skeletons/SearchSongListSkeleton";
import songApi from "../api/modules/song.api";
import { toast } from "react-toastify";
import PlaylistPopup from "../components/PlaylistPopup";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";

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
          width="300"
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
  const [onSearch, setOnSearch] = useState(false);
  const { t } = useTranslation();

  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaylistPopupOpen, setIsPlaylistPopupOpen] = useState(false);

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

      const { response, error } = await songApi.searchSong({ keyword: query });

      if (response) {
        setSongs(response.searchResult);
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
    <Box sx={{ p: 3 }}>
      <Stack spacing={2} sx={{ maxWidth: "80%", margin: "auto" }}>
        <TextField
          sx={{ maxWidth: "100%", margin: "0 auto" }}
          color="success"
          placeholder={t("formField.searchInput")}
          fullWidth
          autoFocus
          value={debounceQuery}
          onChange={(e) => setDebounceQuery(e.target.value)}
        />

        <AnimatePresence mode="wait">
          {onSearch ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SearchSongListSkeleton count={{ xs: 1, sm: 2, md: 6, lg: 7 }} />
            </motion.div>
          ) : songs.length === 0 ? (
            <EmptySearch key="empty" query={query} />
          ) : (
            <motion.div
              key={query}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <SearchSongList
                songs={songs}
                setSelectedSong={setSelectedSong}
                setIsPlaylistPopupOpen={setIsPlaylistPopupOpen}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>

      <PlaylistPopup
        isPlaylistPopupOpen={isPlaylistPopupOpen}
        setIsPlaylistPopupOpen={setIsPlaylistPopupOpen}
        selectedSong={selectedSong}
      />
    </Box>
  );
};

export default SearchPage;
