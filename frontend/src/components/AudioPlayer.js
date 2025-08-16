import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { playNext, playShuffle, playRepeat } from "../redux/slices/playerSlice";

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const prevSongRef = useRef(null);

  const { currentSong, isPlaying, repeatMode, isShuffle, queueType } =
    useSelector((state) => state.player);

  const queueTypeRef = useRef(queueType);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;

    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
    if (isSongChange) {
      audio.src = currentSong?.audioUrl;

      audio.currentTime = 0;

      prevSongRef.current = currentSong?.audioUrl;

      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;

    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;

    if (repeatMode === 1 && !isSongChange) {
      audio.currentTime = 0;

      if (isPlaying) audio.play();
    }
  }, [currentSong]);

  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  useEffect(() => {
    queueTypeRef.current = queueType;
  }, [queueType]);

  useEffect(() => {
    const audio = audioRef.current;

    let timer = null;

    const handleEnded = () => {
      timer = setTimeout(() => {
        if (isShuffle && queueTypeRef.current !== "init") {
          dispatch(playShuffle());
        } else if (repeatMode !== -1) {
          dispatch(playRepeat());
        } else if (
          queueTypeRef.current !== "init" &&
          isShuffle === false &&
          repeatMode === -1
        ) {
          dispatch(playNext());
        }
      }, 5000);
    };

    audio?.addEventListener("ended", handleEnded);

    return () => {
      audio?.removeEventListener("ended", handleEnded);
      if (timer) clearTimeout(timer);
    };
  }, [dispatch, isShuffle, repeatMode]);

  return <audio ref={audioRef} />;
};

export default AudioPlayer;
