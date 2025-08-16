import { createSlice } from "@reduxjs/toolkit";
import { themeModes } from "../../configs/theme.configs";

const themeModeSlice = createSlice({
  name: "ThemeMode",
  initialState: {
    themeMode: localStorage.getItem("themeMode")
      ? localStorage.getItem("themeMode")
      : themeModes.dark,
  },
  reducers: {
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;

      localStorage.setItem("themeMode", action.payload);
    },
  },
});

export const { setThemeMode } = themeModeSlice.actions;

export default themeModeSlice.reducer;
