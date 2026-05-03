import i18n from "i18next";
import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@app/store";
import { useAuth } from "@features/user";
import { useDebounce } from "@hooks";
import { selectSettings, saveSettings } from "../slices/settingsSlice";
import { selectSettingsReady } from "../selectors";
import type { Settings } from "../types";

const RTL_LANGS = ["ar", "fa", "he", "ur"];

/**
 * Checks if a given language is right-to-left (RTL).
 * @param lang - Optional language code to check. If not provided, defaults to "en".
 * @returns True if the language is RTL, false otherwise.
 */
export function isRtl(lang?: string | null) {
  const l = (lang || "en").split("-")[0];
  return RTL_LANGS.includes(l);
}

/**
 * Manages the current language state and provides functions to change or toggle the language.
 */
export function useLanguage() {
  const { t } = useTranslation("common");
  const { user } = useAuth();

  const initial = (i18n.language || "en").split("-")[0];
  const [current, setCurrent] = useState<string>(initial);

  // Debounce writes to Firestore to avoid rapid updates
  const debouncedLang = useDebounce(current, 500);
  const settings = useSelector(selectSettings) as Settings;
  const dispatch = useDispatch<AppDispatch>();

  const settingsReady = useSelector(selectSettingsReady);

  const appliedInitialRef = useRef(false);

  // Reset applied flag when user changes
  useEffect(() => {
    if (!user) appliedInitialRef.current = false;
  }, [user]);

  // Load persisted language from settings on mount or when user changes
  useEffect(() => {
    if (!user || !settingsReady) return;
    const stored = settings?.account?.language;
    if (appliedInitialRef.current) return;
    (async () => {
      if (stored && typeof stored === "string") {
        setCurrent(stored.split("-")[0]);
        await i18n.changeLanguage(stored);
        appliedInitialRef.current = true;
      }
    })().catch(() => {});
  }, [user, settingsReady, settings?.account?.language]);

  // Persist debounced language via Redux saveSettings
  useEffect(() => {
    if (!user) return;
    if (!debouncedLang) return;
    (async () => {
      try {
        await dispatch(
          saveSettings({
            account: { language: debouncedLang },
          } as Partial<Settings>),
        );
      } catch {
        // ignore
      }
    })();
  }, [debouncedLang, user, dispatch]);

  // change language (immediate)
  const change = useCallback(async (lng: string) => {
    const base = (lng || "en").split("-")[0];
    setCurrent(base);
    await i18n.changeLanguage(lng);
  }, []);

  const toggle = useCallback(() => {
    const next = current === "he" ? "en" : "he";
    return change(next);
  }, [current, change]);

  const name = useMemo(() => t(`languages.${current}`), [t, current]);
  const isRtl = useMemo(() => RTL_LANGS.includes(current), [current]);

  // Update document language and direction when current language changes
  useEffect(() => {
    try {
      document.documentElement.lang = current;
      document.documentElement.dir = isRtl ? "rtl" : "ltr";
    } catch {
      // ignore (non-browser environments)
    }
  }, [current, isRtl]);

  return { current, name, change, toggle, isRtl } as const;
}
