import { useState, useEffect } from "react";
import { Box, Stack, TextField, Typography, Fade } from "@mui/material";
import SearchSongList from "../components/SearchSongList";
import SearchSongListSkeleton from "../components/skeletons/SearchSongListSkeleton";
import songApi from "../api/modules/song.api";
import { toast } from "react-toastify";
import PlaylistPopup from "../components/PlaylistPopup";
import { useTranslation } from "react-i18next";

const EmptySearch = ({ query }) => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="35vh"
    >
      <img
        src="/ronaldo_hands_up1-removebg-preview.png"
        alt="Search Placeholder"
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

        {!onSearch && songs.length === 0 && <EmptySearch query={query} />}

        {onSearch ? (
          <SearchSongListSkeleton count={{ xs: 1, sm: 2, md: 6, lg: 10 }} />
        ) : (
          <SearchSongList
            songs={songs}
            setSelectedSong={setSelectedSong}
            setIsPlaylistPopupOpen={setIsPlaylistPopupOpen}
          />
        )}
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
