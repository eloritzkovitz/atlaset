import i18n from "i18next";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@app/store";
import { useAuth } from "@features/user";
import { useDebounce } from "@hooks";
import { selectSettings, saveSettings } from "../slices/settingsSlice";
import { selectSettingsReady } from "../selectors";
import type { Settings } from "../types";

const RTL_LANGS = ["ar", "fa", "he", "ur"];

// Module-level flag to avoid persisted-load races across hook instances
let appliedInitial = false;

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

  const debouncedLang = useDebounce(current, 500);
  const settings = useSelector(selectSettings) as Settings;
  const dispatch = useDispatch<AppDispatch>();
  const settingsReady = useSelector(selectSettingsReady);

  // Reset appliedInitial when user logs out to allow new user's settings to apply on next load
  useEffect(() => {
    if (!user) appliedInitial = false;
  }, [user]);

  // Listen for external language changes and update state accordingly
  useEffect(() => {
    const handle = (lng: string) => setCurrent((lng || "en").split("-")[0]);
    i18n.on?.("languageChanged", handle);
    return () => i18n.off?.("languageChanged", handle);
  }, []);

  // On initial load, apply language from settings if available and not already applied
  useEffect(() => {
    if (!user || !settingsReady || appliedInitial) return;
    const stored = settings?.account?.language;
    if (typeof stored === "string") {
      setCurrent(stored.split("-")[0]);
      void i18n.changeLanguage(stored).catch((e) => { void e; });
      appliedInitial = true;
    }
  }, [user, settingsReady, settings?.account?.language]);

  // Persist language changes to settings with debounce to avoid rapid updates
  useEffect(() => {
    if (!user || !debouncedLang) return;
    void dispatch(
      saveSettings({
        account: { language: debouncedLang },
      } as Partial<Settings>),
    ).catch((e) => { void e; });
  }, [debouncedLang, user, dispatch]);

  // Memoize the change and toggle functions to avoid unnecessary re-renders
  const change = useCallback((lng: string) => {
    const base = (lng || "en").split("-")[0];
    appliedInitial = true;
    setCurrent(base);
    void i18n.changeLanguage(lng).catch((e) => { void e; });
  }, []);

  const toggle = useCallback(
    () => change(current === "he" ? "en" : "he"),
    [current, change],
  );

  const name = useMemo(() => t(`languages.${current}`), [t, current]);
  const isRtlVal = useMemo(() => isRtl(current), [current]);

  // Apply language and direction to document
  useEffect(() => {
    try {
      document.documentElement.lang = current;
      document.documentElement.dir = isRtlVal ? "rtl" : "ltr";
    } catch (e) { void e; }
  }, [current, isRtlVal]);

  return { current, name, change, toggle, isRtl: isRtlVal } as const;
}
