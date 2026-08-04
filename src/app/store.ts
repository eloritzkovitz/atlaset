import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { mapApi } from "@features/atlas/map/api/mapApi";
import { countriesApi } from "@features/countries/api/countriesApi";
import { achievementsApi } from "@features/dashboard/achievements/api/achievementsApi";
import quizSettingsReducer from "@features/quizzes/quiz/slices/quizSettingsSlice";
import type { AccentKey, ThemeKey } from "@features/settings/display/types";
import {
  ACCENT_CACHE_KEY,
  THEME_CACHE_KEY,
} from "@features/settings/display/utils/theme";
import settingsReducer from "@features/settings/common/slices/settingsSlice";
import authReducer from "@features/user/auth/slices/authSlice";
import { getCachedValue } from "@utils";

const rootReducer = combineReducers({
  auth: authReducer,
  settings: settingsReducer,
  quizSettings: quizSettingsReducer,
  [achievementsApi.reducerPath]: achievementsApi.reducer,
  [countriesApi.reducerPath]: countriesApi.reducer,
  [mapApi.reducerPath]: mapApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// Load preloaded display settings from cache
const getPreloadedState = (): Partial<RootState> | undefined => {
  try {
    const theme = getCachedValue<ThemeKey | null>(THEME_CACHE_KEY, null);
    const accent = getCachedValue<AccentKey | null>(ACCENT_CACHE_KEY, null);

    if (theme || accent) {
      const initialSettingsState = settingsReducer(undefined, { type: "" });

      return {
        settings: {
          ...initialSettingsState,
          settings: {
            ...initialSettingsState.settings,
            display: {
              ...initialSettingsState.settings?.display,
              ...(theme ? { theme } : {}),
              ...(accent ? { accent } : {}),
            },
          },
        },
      };
    }
  } catch {
    // Fall back to reducer defaults
  }
  return undefined;
};

/** Configures the Redux store. */
export const store = configureStore({
  reducer: rootReducer,
  preloadedState: getPreloadedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      achievementsApi.middleware,
      countriesApi.middleware,
      mapApi.middleware,
    ),
});

export type AppDispatch = typeof store.dispatch;
