import { configureStore } from "@reduxjs/toolkit";
import authModalSlice from "./slices/authModalSlice";
import playerSlice from "./slices/playerSlice";
import languageModeSlice from "./slices/languageModeSlice";
import userSlice from "./slices/userSlice";
import appStateSlice from "./slices/appStateSlice";
import themeModeSlice from "./slices/themeModeSlice";
import statsDataSlice from "./slices/statsDataSlice";

import { injectStore } from "../utils/storeUtil";

const store = configureStore({
  reducer: {
    authModal: authModalSlice,
    user: userSlice,
    appState: appStateSlice,
    themeMode: themeModeSlice,
    player: playerSlice,
    languageMode: languageModeSlice,
    statsData: statsDataSlice,
  },
});

injectStore(store);

export default store;
