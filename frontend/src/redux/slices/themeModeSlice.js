import { createSlice } from "@reduxjs/toolkit";

const themeModeSlice = createSlice({
  name: "ThemeMode",
  initialState: {
    themeMode: localStorage.getItem("themeMode")
      ? localStorage.getItem("themeMode")
      : "dark",
  },
  reducers: {
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
      console.log("themeMode", action.payload);
      localStorage.setItem("themeMode", action.payload);
    },
  },
});

export const { setThemeMode } = themeModeSlice.actions;

export default themeModeSlice.reducer;
