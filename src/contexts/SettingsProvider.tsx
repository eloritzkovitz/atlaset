import { useEffect, useRef, type PropsWithChildren } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loadSettings,
  saveSettings,
  resetSettingsThunk,
  selectSettings,
  selectSettingsLoading,
  selectSettingsReady,
} from "@features/settings";
import { selectAuthReady, selectAuthUser } from "@features/user";
import { SettingsContext } from "./SettingsContext";
import type { AppDispatch } from "../store";

export function SettingsProvider({ children }: PropsWithChildren<object>) {
  const settings = useSelector(selectSettings);
  const loading = useSelector(selectSettingsLoading);
  const ready = useSelector(selectSettingsReady);
  const authReady = useSelector(selectAuthReady);
  const authUser = useSelector(selectAuthUser);
  const dispatch = useDispatch<AppDispatch>();

  // Load settings when user changes
  const hasLoadedSettings = useRef<string | null>(null);
  useEffect(() => {
    const userId = authUser?.uid || null;
    if (authReady && userId && hasLoadedSettings.current !== userId) {
      dispatch(loadSettings());
      hasLoadedSettings.current = userId;
    }
    // If user logs out, reset ref so next login reloads settings
    if (!userId) {
      hasLoadedSettings.current = null;
    }
  }, [authReady, authUser, dispatch]);

  // Apply theme class to document
  useEffect(() => {
    const theme = settings.display?.theme ?? "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [settings.display?.theme]);

  // Update settings via Redux
  const updateSettings = async (
    updates: Partial<typeof settings>
  ): Promise<void> => {
    await dispatch(saveSettings(updates));
  };

  // Reset settings via Redux
  const resetSettings = async (): Promise<void> => {
    await dispatch(resetSettingsThunk());
  };

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, resetSettings, loading, ready }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
