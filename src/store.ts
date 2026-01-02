import { configureStore } from "@reduxjs/toolkit";
import { quizSettingsReducer } from "@features/quizzes";

export const store = configureStore({
  reducer: {
    quizSettings: quizSettingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
