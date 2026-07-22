import {
  useEffect,
  useRef,
  useLayoutEffect,
  type PropsWithChildren,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loadSettings,
  saveSettings,
  selectSettings,
  selectSettingsLoading,
  resetSettingsThunk,
} from "@features/settings/common/slices/settingsSlice";
import { selectSettingsReady } from "@features/settings/selectors";
import { applyTheme } from "@features/settings/display/utils/theme";
import {
  selectAuthReady,
  selectAuthUser,
} from "@features/user/auth/slices/authSlice";
import { setAppDateLocale } from "@utils/date";
import { SettingsContext } from "./SettingsContext";
import type { AppDispatch } from "../store";

export function SettingsProvider({ children }: PropsWithChildren<object>) {
  const settings = useSelector(selectSettings);
  const loading = useSelector(selectSettingsLoading);
  const rawReady = useSelector(selectSettingsReady);
  const authReady = useSelector(selectAuthReady);
  const authUser = useSelector(selectAuthUser);
  const dispatch = useDispatch<AppDispatch>();

  // Track if settings have booted at least once for the current session
  const hasBooted = useRef(false);
  if (rawReady) {
    hasBooted.current = true;
  }
  const ready = hasBooted.current || rawReady;

  // Track if settings have been loaded for the current user
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

  // Apply theme class to document before paint
  useLayoutEffect(() => applyTheme(settings.display), [settings.display]);

  // Update app date locale when settings change
  useEffect(() => {
    try {
      setAppDateLocale(settings?.localization?.dateLocale ?? null);
    } catch {
      // ignore in non-browser/test env
    }
  }, [settings?.localization?.dateLocale]);

  // Update settings via Redux
  const updateSettings = async (
    updates: Partial<typeof settings>,
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
