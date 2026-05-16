import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "@app/store";
import { defaultSettings } from "../constants/defaultSettings";
import { settingsService } from "../services/settingsService";
import type { Settings } from "../../types";

export const loadSettings = createAsyncThunk(
  "settings/load",
  async () => await settingsService.load(),
);

export const saveSettings = createAsyncThunk(
  "settings/save",
  async (updates: Partial<Settings>, { getState }) => {
    const state = (getState() as RootState).settings.settings;
    const newSettings = { ...state, ...updates, id: "main" };

    // Avoid unnecessary saves: if merged settings are identical to current state, skip persistence
    try {
      const currentJson = JSON.stringify(state || {});
      const newJson = JSON.stringify(newSettings || {});
      if (currentJson === newJson) {
        return state;
      }
    } catch {
      // If serialization fails, fall back to attempting save
    }

    await settingsService.save(newSettings);
    return newSettings;
  },
);

export const resetSettingsThunk = createAsyncThunk(
  "settings/reset",
  async () => {
    await settingsService.save(defaultSettings);
    return defaultSettings;
  },
);

const initialState = {
  settings: defaultSettings,
  loading: false,
  ready: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSettings.pending, (state) => {
        state.loading = true;
        state.ready = false;
      })
      .addCase(
        loadSettings.fulfilled,
        (state, action: PayloadAction<Settings>) => {
          state.settings = action.payload;
          state.loading = false;
          state.ready = true;
        },
      )
      .addCase(loadSettings.rejected, (state) => {
        state.loading = false;
        state.ready = false;
      })
      .addCase(
        saveSettings.fulfilled,
        (state, action: PayloadAction<Settings>) => {
          state.settings = action.payload;
        },
      )
      .addCase(
        resetSettingsThunk.fulfilled,
        (state, action: PayloadAction<Settings>) => {
          state.settings = action.payload;
        },
      );
  },
});

export const selectSettings = (state: RootState) => state.settings.settings;
export const selectSettingsLoading = (state: RootState) =>
  state.settings.loading;
// selectSettingsReady is now in ../selectors
export default settingsSlice.reducer;
