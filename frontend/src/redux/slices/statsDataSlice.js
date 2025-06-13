import { createSlice } from "@reduxjs/toolkit";

const statsDataSlice = createSlice({
  name: "statsDataSlice",
  initialState: {
    totalUsers: 0,
    totalSongs: 0,
    totalArtists: 0,
    totalPlaylists: 0,

    listUsers: [],
    listSongs: [],
    listArtists: [],
    listPlaylists: [],

    isLoading: false,
  },
  reducers: {
    setListUsers: (state, action) => {
      state.listUsers = action.payload;
    },
    setListSongs: (state, action) => {
      state.listSongs = action.payload;
    },
    setListPlaylists: (state, action) => {
      state.listPlaylists = action.payload;
    },
    setListArtists: (state, action) => {
      state.listArtists = action.payload;
    },
    setTotalUsers: (state, action) => {
      state.totalUsers = action.payload;
    },
    setTotalSongs: (state, action) => {
      state.totalSongs = action.payload;
    },
    setTotalPlaylists: (state, action) => {
      state.totalPlaylists = action.payload;
    },
    setTotalArtists: (state, action) => {
      state.totalArtists = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setListUsers,
  setListSongs,
  setListPlaylists,
  setListArtists,
  setTotalUsers,
  setTotalSongs,
  setTotalPlaylists,
  setTotalArtists,
  setIsLoading,
} = statsDataSlice.actions;

export default statsDataSlice.reducer;
