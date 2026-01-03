import { configureStore } from "@reduxjs/toolkit";
import { countryDataReducer } from "@features/countries";
import { quizSettingsReducer } from "@features/quizzes";

export const store = configureStore({
  reducer: {
    countryData: countryDataReducer,
    quizSettings: quizSettingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
