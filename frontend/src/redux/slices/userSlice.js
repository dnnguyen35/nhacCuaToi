import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "User",
  initialState: {
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    wishlist: localStorage.getItem("wishlist")
      ? JSON.parse(localStorage.getItem("wishlist"))
      : [],
    allPlaylist: localStorage.getItem("allPlaylist")
      ? JSON.parse(localStorage.getItem("allPlaylist"))
      : [],
    playlist: localStorage.getItem("playlist")
      ? JSON.parse(localStorage.getItem("playlist"))
      : { id: -1, isNull: true },
  },
  reducers: {
    setUser: (state, action) => {
      if (action.payload === null) {
        localStorage.removeItem("actkn");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshtkn");
        localStorage.removeItem("wishlist");
        localStorage.removeItem("playlist");
        localStorage.removeItem("allPlaylist");

        state.user = null;
        state.allPlaylist = [];
        state.wishlist = [];
        state.playlist = [];
      } else {
        localStorage.setItem("user", JSON.stringify(action.payload.userData));

        if (action.payload.token)
          localStorage.setItem("actkn", action.payload.token);

        if (action.payload.refresh_token)
          localStorage.setItem("refreshtkn", action.payload.refresh_token);
      }
      state.user = action.payload?.userData;
    },
    setWishlist: (state, action) => {
      localStorage.setItem("wishlist", JSON.stringify(action.payload));
      state.wishlist = action.payload;
    },
    setAllPlaylist: (state, action) => {
      localStorage.setItem("allPlaylist", JSON.stringify(action.payload));
      state.allPlaylist = action.payload;
    },
    setPlaylist: (state, action) => {
      localStorage.setItem("playlist", JSON.stringify(action.payload));
      state.playlist = action.payload;
    },
  },
});

export const { setUser, setWishlist, setAllPlaylist, setPlaylist } =
  userSlice.actions;

export default userSlice.reducer;
