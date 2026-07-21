import { configureStore, type ReducersMapObject } from "@reduxjs/toolkit";
import countryDataReducer from "@features/countries/slices/countryDataSlice";
import quizSettingsReducer from "@features/quizzes/quiz/slices/quizSettingsSlice";
import settingsReducer from "@features/settings/common/slices/settingsSlice";
import authReducer from "@features/user/auth/slices/authSlice";

const reducers = {
  auth: authReducer,
  countryData: countryDataReducer,
  settings: settingsReducer,
  quizSettings: quizSettingsReducer,
} as const;

type ReducersMap = typeof reducers;
export type RootState = {
  [K in keyof ReducersMap]: ReturnType<ReducersMap[K]>;
};

// Load preloaded state from localStorage for theme, with fallback to reducers' initial state
const getPreloadedState = (): RootState | undefined => {
  try {
    const base = {
      auth: reducers.auth(undefined, { type: "" }),
      countryData: reducers.countryData(undefined, { type: "" }),
      settings: reducers.settings(undefined, { type: "" }),
      quizSettings: reducers.quizSettings(undefined, { type: "" }),
    } as RootState;

    const t =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("atlaset.theme")
        : null;
    if (t === "light" || t === "dark" || t === "system") {
      return {
        ...base,
        settings: {
          ...base.settings,
          settings: {
            ...base.settings.settings,
            display: { ...(base.settings.settings.display ?? {}), theme: t },
          },
        },
      };
    }
    return base;
  } catch {
    return undefined;
  }
};

export const store = configureStore<RootState>({
  reducer: reducers as ReducersMapObject<RootState>,
  preloadedState: getPreloadedState(),
});
export type AppDispatch = typeof store.dispatch;
