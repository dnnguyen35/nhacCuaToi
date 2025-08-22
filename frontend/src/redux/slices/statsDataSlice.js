import { createSlice } from "@reduxjs/toolkit";

const statsDataSlice = createSlice({
  name: "statsDataSlice",
  initialState: {
    totalUsers: 0,
    totalSongs: 0,
    totalArtists: 0,
    totalPlaylists: 0,
    totalPayments: 0,
    totalProfit: 0,

    listUsers: [],
    listSongs: [],
    listArtists: [],
    listPlaylists: [],
    listPayments: [],

    userOnline: [],

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
    setListPayments: (state, action) => {
      state.listPayments = action.payload;
    },
    setUserOnline: (state, action) => {
      state.userOnline = action.payload;
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
    setTotalPayments: (state, action) => {
      state.totalPayments = action.payload;
    },
    setTotalProfit: (state, action) => {
      state.totalProfit = action.payload;
    },

    setNewPayment: (state, action) => {
      const newPayment = action.payload;

      state.totalPayments = state.totalPayments + 1;
      state.listPayments = [...state.listPayments, newPayment];
    },
    setUpdatePayment: (state, action) => {
      const updatePayment = action.payload;
      const newListPayments = state.listPayments.map((p) =>
        p.orderId === updatePayment.orderId ? updatePayment : p
      );

      state.listPayments = newListPayments;

      if (updatePayment.status === "completed") {
        state.totalProfit = state.totalProfit + updatePayment.amount;
      }
    },
    setNewUser: (state, action) => {
      const newUser = action.payload;

      state.totalUsers = state.totalUsers + 1;
      state.listUsers = [...state.listUsers, newUser];
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
  setListPayments,
  setUserOnline,
  setTotalUsers,
  setTotalSongs,
  setTotalPlaylists,
  setTotalArtists,
  setTotalPayments,
  setTotalProfit,
  setNewPayment,
  setUpdatePayment,
  setNewUser,
  setIsLoading,
} = statsDataSlice.actions;

export default statsDataSlice.reducer;
