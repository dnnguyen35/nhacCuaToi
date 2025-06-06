import { createSlice } from "@reduxjs/toolkit";

const playerSlice = createSlice({
  name: "player",
  initialState: {
    currentSong: { isNull: true },
    isPlaying: false,
    queue: [],
    currentIndex: -1,
    repeatMode: -1,
    isShuffle: false,
    queueType: "",
  },
  reducers: {
    initializeQueue: (state, action) => {
      console.log("action.payload: ", action.payload);
      state.queue = action.payload;
      state.currentSong = action.payload[0];
      state.currentIndex = state.currentIndex === -1 ? 0 : state.currentIndex;
      state.queueType = "init";
    },

    playPlaylist: (state, action) => {
      console.log("action.payload: ", action.payload);
      const { songs, startIndex = 0 } = action.payload;
      console.log("song", songs);
      if (songs.length === 0) return;

      state.queue = songs;
      state.currentSong = songs[startIndex];
      state.currentIndex = startIndex;
      state.isPlaying = true;
      state.queueType = "playlist";
    },

    playWishlist: (state, action) => {
      const { songs, startIndex = 0 } = action.payload;
      if (songs.length === 0) return;

      state.queue = songs;
      state.currentSong = songs[startIndex];
      state.currentIndex = startIndex;
      state.isPlaying = true;
      state.queueType = "wishlist";
    },

    setQueue: (state, action) => {
      const newQueue = action.payload;

      if (newQueue !== null) {
        state.queue = newQueue;
      }
    },

    setCurrentSong: (state, action) => {
      const song = action.payload;
      if (!song) {
        state.queue = [];
        state.currentSong = { isNull: true };
        state.isPlaying = false;
        return;
      }

      const index = state.queue.findIndex((s) => s.id === song.id);
      state.currentSong = song;
      state.currentIndex = index !== -1 ? index : state.currentIndex;
      state.isPlaying = true;
    },

    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },

    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },

    playNext: (state) => {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex < state.queue.length) {
        state.currentIndex = nextIndex;
        state.currentSong = state.queue[nextIndex];
        state.isPlaying = true;
      } else {
        state.isPlaying = false;
      }
    },

    playPrevious: (state) => {
      const prevIndex = state.currentIndex - 1;
      if (prevIndex >= 0) {
        state.currentIndex = prevIndex;
        state.currentSong = state.queue[prevIndex];
        state.isPlaying = true;
      } else {
        state.isPlaying = false;
      }
    },

    setRepeatMode: (state, action) => {
      state.repeatMode = action.payload;
      state.isShuffle = false;
    },

    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
      state.repeatMode = -1;
    },

    playShuffle: (state) => {
      if (state.queue.length === 0) return;

      let randomIndex = -1;

      do {
        randomIndex = Math.floor(Math.random() * state.queue.length);
      } while (state.currentIndex === randomIndex && state.queue.length > 1);

      state.currentIndex = randomIndex;
      state.currentSong = state.queue[randomIndex];
      state.isPlaying = true;
    },

    playRepeat: (state) => {
      if (state.queue.length === 0) return;

      if (state.repeatMode === 1) {
        state.isPlaying = true;
        return;
      }

      if (state.repeatMode === 0) {
        const nextIndex = state.currentIndex + 1;
        if (nextIndex < state.queue.length) {
          state.currentIndex = nextIndex;
          state.currentSong = state.queue[nextIndex];
          state.isPlaying = true;
        } else {
          state.currentIndex = 0;
          state.currentSong = state.queue[0];
          state.isPlaying = true;
        }
      }
    },
    deleteSongFromQueue: (state, action) => {
      const deleteSong = action.payload;
      const deleteIndex = state.queue?.findIndex((s) => s.id === deleteSong.id);

      const newQueue = state.queue.filter((s) => s.id !== deleteSong.id);

      if (deleteIndex === -1) return;

      if (deleteIndex < state.currentIndex) {
        state.queue = newQueue;
        state.currentIndex = state.currentIndex - 1;
      } else if (deleteIndex === state.currentIndex) {
        if (newQueue.length > deleteIndex) {
          state.queue = newQueue;

          state.currentIndex = deleteIndex;
          state.currentSong = newQueue[deleteIndex];
        } else if (newQueue.length > 0) {
          state.queue = newQueue;

          state.currentIndex = deleteIndex - 1;
          state.currentSong = newQueue[deleteIndex - 1];
        } else {
          state.queue = [];
          state.currentSong = { isNull: true };
          state.isPlaying = false;
        }
      } else {
        state.queue = newQueue;
      }
    },
  },
});

export const {
  initializeQueue,
  playPlaylist,
  playWishlist,
  setQueue,
  setCurrentSong,
  setIsPlaying,
  togglePlay,
  playNext,
  playPrevious,
  setRepeatMode,
  toggleShuffle,
  playShuffle,
  playRepeat,
  deleteSongFromQueue,
} = playerSlice.actions;

export default playerSlice.reducer;
