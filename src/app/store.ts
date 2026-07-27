import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { mapApi } from "@features/atlas/map/api/mapApi";
import { countriesApi } from "@features/countries/api/countriesApi";
import { achievementsApi } from "@features/dashboard/achievements/api/achievementsApi";
import quizSettingsReducer from "@features/quizzes/quiz/slices/quizSettingsSlice";
import settingsReducer from "@features/settings/common/slices/settingsSlice";
import authReducer from "@features/user/auth/slices/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  settings: settingsReducer,
  quizSettings: quizSettingsReducer,
  [achievementsApi.reducerPath]: achievementsApi.reducer,
  [countriesApi.reducerPath]: countriesApi.reducer,
  [mapApi.reducerPath]: mapApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// Load preloaded state from localStorage if available
const getPreloadedState = (): Partial<RootState> | undefined => {
  try {
    const theme =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("atlaset.theme")
        : null;

    if (theme === "light" || theme === "dark" || theme === "system") {
      const initialSettingsState = settingsReducer(undefined, { type: "" });

      return {
        settings: {
          ...initialSettingsState,
          settings: {
            ...initialSettingsState.settings,
            display: {
              ...initialSettingsState.settings?.display,
              theme,
            },
          },
        },
      };
    }
  } catch {
    // Fall back to reducer defaults if localStorage read fails
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
