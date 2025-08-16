import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "User",
  initialState: {
    user: sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : null,
    wishlist: sessionStorage.getItem("wishlist")
      ? JSON.parse(sessionStorage.getItem("wishlist"))
      : [],
    allPlaylist: sessionStorage.getItem("allPlaylist")
      ? JSON.parse(sessionStorage.getItem("allPlaylist"))
      : [],
    playlist: sessionStorage.getItem("playlist")
      ? JSON.parse(sessionStorage.getItem("playlist"))
      : { id: -1, isNull: true },
  },
  reducers: {
    setUser: (state, action) => {
      if (action.payload === null) {
        sessionStorage.removeItem("actkn");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("refreshtkn");
        sessionStorage.removeItem("wishlist");
        sessionStorage.removeItem("playlist");
        sessionStorage.removeItem("allPlaylist");

        state.user = null;
        state.allPlaylist = [];
        state.wishlist = [];
        state.playlist = [];
      } else {
        sessionStorage.setItem("user", JSON.stringify(action.payload.userData));

        if (action.payload.token)
          sessionStorage.setItem("actkn", action.payload.access_token);

        if (action.payload.refresh_token)
          sessionStorage.setItem("refreshtkn", action.payload.refresh_token);
      }
      state.user = action.payload?.userData;
    },
    setWishlist: (state, action) => {
      sessionStorage.setItem("wishlist", JSON.stringify(action.payload));
      state.wishlist = action.payload;
    },
    setAllPlaylist: (state, action) => {
      sessionStorage.setItem("allPlaylist", JSON.stringify(action.payload));
      state.allPlaylist = action.payload;
    },
    setPlaylist: (state, action) => {
      sessionStorage.setItem("playlist", JSON.stringify(action.payload));
      state.playlist = action.payload;
    },
  },
});

export const { setUser, setWishlist, setAllPlaylist, setPlaylist } =
  userSlice.actions;

export default userSlice.reducer;
