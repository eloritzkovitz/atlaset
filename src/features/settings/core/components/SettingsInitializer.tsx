import { useEffect, useRef, type PropsWithChildren } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@app/store";
import {
  selectAuthReady,
  selectAuthUser,
} from "@features/user/auth/slices/authSlice";
import { setAppDateLocale } from "@utils";
import { loadSettings, selectSettings } from "../slices/settingsSlice";

/** Initializes the settings for the application. */
export function SettingsInitializer({ children }: PropsWithChildren) {
  const settings = useSelector(selectSettings);
  const authReady = useSelector(selectAuthReady);
  const authUser = useSelector(selectAuthUser);
  const dispatch = useDispatch<AppDispatch>();

  const hasLoadedSettings = useRef<string | null>(null);

  // Sync settings when the logged-in user changes
  useEffect(() => {
    const userId = authUser?.uid || null;

    if (authReady && userId && hasLoadedSettings.current !== userId) {
      dispatch(loadSettings());
      hasLoadedSettings.current = userId;
    }

    if (!userId) {
      hasLoadedSettings.current = null;
    }
  }, [authReady, authUser, dispatch]);

  // Sync date locale
  useEffect(() => {
    try {
      setAppDateLocale(settings?.account?.languageRegion?.dateLocale ?? null);
    } catch {
      // ignore non-browser/test env
    }
  }, [settings?.account?.languageRegion?.dateLocale]);

  return <>{children}</>;
}
