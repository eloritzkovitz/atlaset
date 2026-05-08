import i18n from "i18next";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@app/store";
import { getByCode, LANGUAGES } from "@constants/languages";
import { useAuth } from "@features/user";
import { saveSettings } from "../slices/settingsSlice";
import type { Settings } from "../types";

/**
 * Checks if a given language is right-to-left (RTL).
 * @param lang - The language code to check. If not provided, defaults to "en".
 * @returns True if the language is RTL, false otherwise.
 */
export function isRtl(lang?: string | null) {
  const base = (lang || "en").split("-")[0];
  const def = getByCode(base);
  return !!def?.isRtl;
}

/**
 * Manages the current language state and provides functions to change or toggle the language.
 */
export function useLanguage() {
  const { t } = useTranslation("common");
  const { user } = useAuth();

  const initial = (i18n.language || "en").split("-")[0];
  const [current, setCurrent] = useState<string>(initial);

  const dispatch = useDispatch<AppDispatch>();

  // Listen for external language changes and update state accordingly
  useEffect(() => {
    const handle = (lng: string) => setCurrent((lng || "en").split("-")[0]);
    i18n.on?.("languageChanged", handle);
    return () => i18n.off?.("languageChanged", handle);
  }, []);

  // Memoize the change and toggle functions to avoid unnecessary re-renders
  const change = useCallback(
    (lng: string) => {
      const base = (lng || "en").split("-")[0];
      if (base === current) return;
      setCurrent(base);
      void i18n.changeLanguage(lng).catch((e) => {
        void e;
      });

      // Persist new language preference; settingsService will coalesce duplicates
      if (user) {
        void dispatch(
          saveSettings({ account: { language: lng } } as Partial<Settings>),
        ).catch(() => {});
      }
    },
    [current, dispatch, user],
  );

  // Toggle to the next language in the list, wrapping around to the start
  const toggle = useCallback(() => {
    if (!Array.isArray(LANGUAGES) || LANGUAGES.length === 0) return;
    const idx = LANGUAGES.findIndex((l) => l.code === current);
    const next = LANGUAGES[(idx + 1) % LANGUAGES.length];
    if (!next) return;
    change(next.code);
  }, [current, change]);

  const name = useMemo(() => t(`languages.${current}`), [t, current]);
  const isRtlVal = useMemo(() => isRtl(current), [current]);

  // Apply language and direction to document
  useEffect(() => {
    try {
      document.documentElement.lang = current;
      document.documentElement.dir = isRtlVal ? "rtl" : "ltr";
    } catch (e) {
      void e;
    }
  }, [current, isRtlVal]);

  return { current, name, change, toggle, isRtl: isRtlVal } as const;
}
