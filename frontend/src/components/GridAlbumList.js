import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
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

const GridAlbumList = ({ albums }) => {
  const isHavePointer = useMediaQuery("(pointer: fine)");
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        px: 2,
      }}
    >
      <Swiper
        modules={[Navigation]}
        navigation={isHavePointer}
        grabCursor
        spaceBetween={40}
        slidesPerView="auto"
        style={{ marginBottom: "8px" }}
        loop
      >
        {albums.map((album) => (
          <SwiperSlide
            key={album.id}
            style={{ width: "152px", height: "auto", paddingBottom: "8px" }}
          >
            <Card
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
                  <Tooltip title={album.title} arrow placement="top">
                    <Typography variant="body1" fontWeight="bold" noWrap>
                      {album.title}
                    </Typography>
                  </Tooltip>
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

export default GridAlbumList;
