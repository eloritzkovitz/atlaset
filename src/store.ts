import { configureStore } from "@reduxjs/toolkit";
import { countryDataReducer } from "@features/countries";
import { quizSettingsReducer } from "@features/quizzes";
import { settingsReducer } from "@features/settings";
import { authReducer } from "@features/user";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    countryData: countryDataReducer,
    settings: settingsReducer,
    quizSettings: quizSettingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
