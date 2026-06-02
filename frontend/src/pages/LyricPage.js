import { motion } from "framer-motion";
import { Box, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { useEffect, useState, useMemo } from "react";
import PageNotFound from "../components/PageNotFound";
import { useTranslation } from "react-i18next";

const LyricPage = () => {
  const { t } = useTranslation();
  const { currentSong } = useSelector((state) => state.player);

  const lyricsArrayRef = useRef([]);

  const lyricsContainerRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const lyricsArray = useMemo(() => {
    if (!currentSong || !currentSong.lyrics) return [];

    return Array.isArray(currentSong.lyrics) ? currentSong.lyrics : [];
  }, [currentSong]);

  useEffect(() => {
    let animationFrameId;

    const updateTimer = () => {
      const audio = document.querySelector("audio");

      if (audio) {
        setCurrentTime(audio.currentTime);
      }

      animationFrameId = requestAnimationFrame(updateTimer);
    };

    animationFrameId = requestAnimationFrame(updateTimer);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (lyricsArray.length === 0) return;

    let left = 0;
    let right = lyricsArray.length - 1;
    let foundedIndex = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const lyric = lyricsArray[mid];

      if (currentTime >= lyric.start && currentTime <= lyric.end) {
        foundedIndex = mid;
        break;
      } else if (currentTime < lyric.start) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    if (foundedIndex === -1 && right >= 0 && right < lyricsArray.length) {
      foundedIndex = right;
    }

    setCurrentIndex(foundedIndex);
  }, [currentTime, lyricsArray]);

  useEffect(() => {
    const container = lyricsContainerRef.current;
    const activeLyric = lyricsArrayRef.current[currentIndex];

    if (!container || !activeLyric) return;

    const scrollTop =
      activeLyric.offsetTop -
      container.clientHeight / 2 +
      activeLyric.clientHeight / 2;

    container.scrollTo({
      top: scrollTop,
      behavior: "smooth",
    });
  }, [currentIndex]);

  if (!currentSong || currentSong.isNull) {
    return <PageNotFound />;
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <Box
        sx={{
          background:
            "linear-gradient(to bottom, rgba(80,56,160,0.8), rgba(33,33,33,0.95), rgba(18,18,18,1))",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mx: { xs: 1, sm: 2, md: 3 },
            pt: { xs: 1, md: 3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 1, md: 2 },
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", md: 400 },
                flexShrink: 0,
                display: "flex",
                justifyContent: {
                  xs: "flex-start",
                  md: "center",
                },
                alignItems: {
                  xs: "flex-start",
                  md: "center",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", md: "column" },
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Paper
                  elevation={10}
                  sx={{
                    width: { xs: 80, sm: 120, md: 200 },
                    height: { xs: 80, sm: 120, md: 200 },
                    borderRadius: 4,
                    overflow: "hidden",
                    flexShrink: 0,
                    alignSelf: { xs: "stretch", md: "flex-start" },
                  }}
                >
                  <Box
                    component="img"
                    src={
                      currentSong.imageUrl
                        ? currentSong.imageUrl
                        : "https://picsum.photos/800"
                    }
                    alt="cover"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Paper>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: { xs: "left", md: "left" },
                    alignSelf: { xs: "stretch", md: "flex-start" },
                  }}
                >
                  <Typography
                    fontWeight={700}
                    sx={{
                      fontSize: { xs: "1rem", md: "1.8rem" },
                      color: "white",
                    }}
                  >
                    {currentSong.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: { xs: "0.85rem", md: "1.1rem" },
                      color: "grey.400",
                    }}
                  >
                    {currentSong.artist}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              ref={lyricsContainerRef}
              sx={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                px: { xs: 1, md: 4 },
                pb: { xs: 2 },
                maxHeight: { xs: "63vh", md: "73vh" },
                minHeight: { xs: "63vh", md: "73vh" },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {lyricsArray.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: { xs: "flex-start", md: "center" },
                    pt: 2,
                    pb: "30vh",
                  }}
                >
                  {lyricsArray.map((lyric, index) => {
                    const distance = Math.abs(currentIndex - index);
                    const isActive = index === currentIndex;

                    return (
                      <Typography
                        key={index}
                        ref={(el) => (lyricsArrayRef.current[index] = el)}
                        sx={{
                          textAlign: "center",
                          py: 1.5,
                          transition: "all 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
                          fontSize: {
                            xs: isActive ? "1.2rem" : "1.05rem",
                            sm: isActive ? "1.4rem" : "1.15rem",
                            md: isActive ? "1.6rem" : "1.2rem",
                          },
                          fontWeight: isActive ? 700 : 400,
                          color: isActive ? "#fff" : "#bdbdbd",
                          opacity:
                            distance === 0
                              ? 1
                              : distance === 1
                                ? 0.85
                                : distance === 2
                                  ? 0.7
                                  : 0.4,
                          transform: isActive ? "scale(1.02)" : "scale(1)",
                        }}
                      >
                        {lyric.text}
                      </Typography>
                    );
                  })}
                </Box>
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: {
                        xs: "1.05rem",
                        sm: "1.15rem",
                        md: "1.2rem",
                      },
                      color: "#fff",
                    }}
                  >
                    {t("lyricsNotAvailable")}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default LyricPage;
