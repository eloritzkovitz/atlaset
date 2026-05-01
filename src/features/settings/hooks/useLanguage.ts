import i18n from "i18next";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

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
 * @returns An object containing the current language code, its display name, and functions to change or toggle the language.
 */
export function useLanguage() {
  const { t } = useTranslation("common");

  // Extract the base language code and memoize it to avoid unnecessary recalculations
  const current = useMemo(
    () => (i18n.language || "en").split("-")[0],
    [
      // re-evaluate when language changes
      i18n.language,
    ],
  );

  const name = useMemo(() => t(`languages.${current}`), [t, current]);

  const change = useCallback((lng: string) => i18n.changeLanguage(lng), []);

  // Toggle between languages
  const toggle = useCallback(() => {
    const next = current === "he" ? "en" : "he";
    return change(next);
  }, [current, change]);

  // Determine if the current language is RTL
  const isRtl = useMemo(() => RTL_LANGS.includes(current), [current]);

  return { current, name, change, toggle, isRtl } as const;
}
