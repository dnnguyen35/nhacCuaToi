import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  PlayArrow,
  FavoriteBorderOutlined,
  PlaylistAdd,
  Favorite,
  Pause,
  List,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import Marquee from "react-fast-marquee";
import { useState } from "react";
import {
  togglePlay,
  setCurrentSong,
  initializeQueue,
} from "../redux/slices/playerSlice";
import { setWishlist } from "../redux/slices/userSlice";
import wishlistApi from "../api/modules/wishlist.api";
import { toast } from "react-toastify";
import { setQueue, deleteSongFromQueue } from "../redux/slices/playerSlice";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const GridArtistList = ({ artists }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        px: 2,
      }}
    >
      <Swiper
        modules={[Navigation]}
        navigation
        grabCursor
        spaceBetween={40}
        slidesPerView="auto"
        style={{ marginBottom: "8px" }}
        loop
      >
        {artists.map((artist, i) => (
          <SwiperSlide
            key={i}
            style={{ width: "152px", height: "auto", paddingBottom: "8px" }}
          >
            <Card
              key={i}
              sx={{
                width: 136,
                height: 240,
                flexShrink: 0,
                px: 1,
                py: 1,
                borderRadius: 2,
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={
                  artist.imageUrl ||
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAP1BMVEWzs7P///+vr6/k5OTs7Oy2tratra3X19fc3NzR0dH8/Pz4+Pjx8fG4uLi9vb3IyMjBwcHFxcXn5+fu7u7Nzc2cgkJPAAAESElEQVR4nO2dC7qjIAxGJdb323b/a53a3rmjrbQCUYLznxV4PpAkEDSKAAAAAAAAAAAAAAAAAAAAAADgUOiB76fYkzy+kxVtc1pN9UNZ50NySkk1oxy76HSSVKslcX8yR4rVK5fiXAPZvRneZ2t2Jsd2xXByPM/SmlSrikoVJ1GkqNQYqnoI35Govb2upYt1NfDXkai4fNB70AWsSG2snZ8zLk2gjtSOG/Sew5j6flgb0nzL+P0whjeKtB4DtZShzVTKzQTvimEtOM2n+KAjC0eRel0O80UxlPWGeiu/SdH3o2/DXlCpPIiJ6iAYxruorSO2IT8Tp69p6Bca3wZfoMxRUF2FD2JrkKlpkB356eosqFTi2+ITTuvoXySHjJRjCFUlOLUxrCd0dL49tJgXFOtcxE5Tcgv2v5Ri1xqmSarUzbeJjhuXodQ9jZUDGEtqqYYssWKilJqcMi00d1rfKhrYBFXhW2WdhM9QaCHMaBjD0A8whOEMoSUiDA04f7Q4f8SHoSdgCEP5hozVk9T9RL4K+PyGvW8VDeffxTi9ofPxr3zDzY16gRqSVSNUSIbOJ/gzJLYO8W3pP5DXx8d1dPgPcUGfW1BVvo2W8A+htLyG6/R3jqxj0pRfUNhuFAxtGHxLLdjjPZR1Dswc7yeERQu+NoxfxG3ssxvKCoc7TFNpk5Sp73KGvNuljAX+hMSOmoHVUN4QcvSwzxDa9sVoKG0h/WHtuwJ2CG1UeP/8hS2lbxMtDZOhrKpiDhUsgrXgXn2eEkPoMvOE45BUXMq9gCE9rQRmMwuc56m4reAXyLVQlH45L4pSxwzc9/NvIHG6gSh7mXnilIFXAQi6Xbu4BWHoUO6PgrOZOdbHNKXMo98VbIsMuRn3G3Y7GkIL+1XskjfRGfcbFslbCKFwhvl10pDm6IR5Mez7ic0xbJAKJNbPMav3A3sJn/QGKfjV98NaYbB9WoY4giYxUe4XBj5C24dQ/peT1jAJF2FUha+kJtl3mCupgWCQ89Qw95Z45PsNw/0oeY0JXzAvnwKL+WRRAseB7NE8sBEMahTJ8rg7GMXEuiO6akMIGmnncvpUiH8ZqXPsVqhFb0eRs99ELPZHNBQVPN0m5XVI5UlS1HN27tVZK+rnHhQNm34QYCjZJyIsiZIh3qGNfaK6ZF2TetWkNCr4blVqNMesj/z80oyiNttp8N6o86I99lcm059V+F+9z1TjYZb3hSVj+36goWXc7R1I7gvL4YP3Qjzs91ISNbmnwVuS7ZL2UNpnfHe1HSnzgTtFp6Y4at3cyJX193t047+45U7OtbLe1xZhw/cLT++G0T+NjqZ2/8GQ7R9jDsN5GHmv+uyB413aPa7Z8+La1896l2kXXD9QD0P/wBCGMPQPDGEIQ//AEIYw9A8MYQhD/8AQhvL32pwvt3djLBv3jX2SjqsgAAAAAAAAAAAAAAAAAAAAAOD/4Q9tQkhDbo2dwAAAAABJRU5ErkJggg=="
                }
                sx={{ borderRadius: 2 }}
              />
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Tooltip title={artist.artist} arrow placement="top">
                    <Typography variant="body1" fontWeight="bold" noWrap>
                      {artist.artist}
                    </Typography>
                  </Tooltip>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    .....
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
                    onClick={() => {
                      return;
                    }}
                  >
                    <List />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default GridArtistList;
