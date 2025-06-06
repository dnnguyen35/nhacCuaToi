import { createSlice } from "@reduxjs/toolkit";
import i18n from "../../i18n";

export const languageModeSlice = createSlice({
  name: "languageMode",
  initialState: {
    languageMode: localStorage.getItem("languageMode")
      ? localStorage.getItem("languageMode")
      : "en",
  },
  reducers: {
    setLanguageMode: (state, action) => {
      state.languageMode = action.payload;
      console.log("languageMode", action.payload);
      localStorage.setItem("languageMode", action.payload);
      i18n.changeLanguage(action.payload);
    },
  },
});

export const { setLanguageMode } = languageModeSlice.actions;

export default languageModeSlice.reducer;
