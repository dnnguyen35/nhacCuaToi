import { Box, IconButton, Slider, Typography, Avatar } from "@mui/material";
import {
  SkipPrevious,
  PlayArrow,
  SkipNext,
  Repeat,
  Shuffle,
  Pause,
  VolumeUp,
  VolumeOff,
  RepeatOne,
  MusicOff,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  togglePlay,
  playNext,
  playPrevious,
  setIsPlaying,
  setRepeatMode,
  toggleShuffle,
} from "../redux/slices/playerSlice";
import { formatDuration } from "../utils/formatDuration";

const PlaybackController = () => {
  const { currentSong, isPlaying, repeatMode, isShuffle } = useSelector(
    (state) => state.player
  );
  const dispatch = useDispatch();
  const audioRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMute, setIsMute] = useState(false);

  console.log("isplaying: ", isPlaying);
  console.log("currentSong: ", currentSong);
  console.log("isShuffle: ", isShuffle);
  console.log("repeatMode: ", repeatMode);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");

    const audio = audioRef.current;

    if (!audio) return;

    const updateCurrentTime = () => {
      console.log("time: ", audio.currentTime);
      setCurrentTime(audio.currentTime);
    };
    const updateDuration = () => setDuration(audio.duration);
    const handleEndedSong = () => {
      dispatch(setIsPlaying(false));
    };

    audio.addEventListener("timeupdate", updateCurrentTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEndedSong);

    return () => {
      audio.removeEventListener("timeupdate", updateCurrentTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEndedSong);
    };
  }, [currentSong]);

  useEffect(() => {
    if (currentSong?.isNull || !audioRef.current) {
      setDuration(0);
      return;
    }

    console.log("duration from playbakc: ", audioRef.current.duration);

    setDuration(audioRef.current.duration);
  }, [currentSong]);

  const handleSeek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleUpdateVolume = (value) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  const handleVolumeMute = () => {
    if (!isMute) {
      setIsMute(true);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    } else {
      setIsMute(false);
      if (audioRef.current) {
        audioRef.current.volume = volume / 100;
      }
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: "background.paper",
        mx: 2,
        mb: 1,
        p: 1,
        px: { xs: 1, sm: 5 },
        borderRadius: 5,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: 3,
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "20%",
          gap: 1,
        }}
      >
        <Avatar
          src={currentSong.imageUrl ? currentSong.imageUrl : undefined}
          alt="Song"
          sx={{
            width: 55,
            height: 55,
            animation: isPlaying ? "spin 7s linear infinite" : "none",
            "@keyframes spin": {
              from: { transform: "rotate(0deg)" },
              to: { transform: "rotate(360deg)" },
            },
          }}
        >
          {!currentSong && <MusicOff fontSize="small" />}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" noWrap>
            {currentSong?.title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" noWrap>
            {currentSong?.artist}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexGrow: 1,
          mx: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => dispatch(toggleShuffle())}
            sx={{ color: isShuffle && "primary.main" }}
          >
            <Shuffle />
          </IconButton>
          <IconButton
            onClick={() => {
              if (isShuffle) {
                dispatch(toggleShuffle());
              }
              dispatch(setRepeatMode(-1));
              dispatch(playPrevious());
            }}
            disabled={currentSong?.isNull ? true : false}
          >
            <SkipPrevious />
          </IconButton>
          <IconButton
            onClick={() => dispatch(togglePlay())}
            disabled={currentSong?.isNull ? true : false}
          >
            {!isPlaying ? (
              <PlayArrow fontSize="large" />
            ) : (
              <Pause fontSize="large" />
            )}
          </IconButton>
          <IconButton
            onClick={() => {
              if (isShuffle) {
                dispatch(toggleShuffle());
              }
              dispatch(setRepeatMode(-1));
              dispatch(playNext());
            }}
            disabled={currentSong?.isNull ? true : false}
          >
            <SkipNext />
          </IconButton>
          {repeatMode === -1 ? (
            <IconButton onClick={() => dispatch(setRepeatMode(0))}>
              <Repeat />
            </IconButton>
          ) : repeatMode === 0 ? (
            <IconButton
              onClick={() => dispatch(setRepeatMode(1))}
              sx={{ color: "primary.main" }}
            >
              <Repeat />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => dispatch(setRepeatMode(-1))}
              sx={{ color: "primary.main" }}
            >
              <RepeatOne />
            </IconButton>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "70%",
            mt: 0.5,
            gap: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{ minWidth: 35, textAlign: "center" }}
          >
            {formatDuration(currentTime)}
          </Typography>
          <Slider
            size="small"
            sx={{ flexGrow: 1 }}
            value={currentTime}
            max={duration}
            step={1}
            aria-label="duration slider"
            onChange={(event, value) => handleSeek(value)}
          />
          <Typography
            variant="caption"
            sx={{ minWidth: 35, textAlign: "center" }}
          >
            {formatDuration(duration)}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: { xs: "70%", sm: "20%", md: "10%" },
          gap: 1,
        }}
      >
        <IconButton onClick={handleVolumeMute}>
          {!isMute ? <VolumeUp /> : <VolumeOff />}
        </IconButton>
        <Slider
          size="small"
          value={volume}
          max={100}
          step={1}
          aria-label="volume slider"
          sx={{ width: { xs: "50%", sm: "80%" } }}
          onChange={(event, value) => {
            setIsMute(false);
            handleUpdateVolume(value);
          }}
        />
      </Box>
    </Box>
  );
};

export default PlaybackController;
