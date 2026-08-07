import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@app/store";
import {
  selectSettings,
  selectSettingsLoading,
  saveSettings,
  resetSettingsThunk,
} from "../slices/settingsSlice";
import { selectSettingsReady } from "../../selectors";

/**
 * Provides access to the app's settings state and actions for updating or resetting settings.
 */
export function useSettings() {
  const settings = useSelector(selectSettings);
  const loading = useSelector(selectSettingsLoading);
  const ready = useSelector(selectSettingsReady);
  const dispatch = useDispatch<AppDispatch>();

  /** Updates the app's settings. */
  const updateSettings = useCallback(
    (updates: Partial<typeof settings>) => dispatch(saveSettings(updates)),
    [dispatch],
  );

  /** Resets the app's settings. */
  const resetSettings = useCallback(
    () => dispatch(resetSettingsThunk()),
    [dispatch],
  );

  return { settings, updateSettings, resetSettings, loading, ready };
}
