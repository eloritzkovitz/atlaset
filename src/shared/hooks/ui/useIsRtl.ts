import { useEffect, useState } from "react";
import i18n from "i18next";

const RTL_LANGS = ["ar", "he", "fa", "ur"];

/**
 * Checks if a given language (or the current i18n language) is right-to-left (RTL).
 * @param lang - Optional language code to check. If not provided, uses the current i18n language.
 * @returns True if the language is RTL, false otherwise.
 */
export function isRtl(lang?: string | null) {
  const l = (lang || i18n.language || "en").split("-")[0];
  return RTL_LANGS.includes(l);
}

/**
 * Determines if the current language is right-to-left (RTL) and updates on language change.
 * @returns True if the current language is RTL, false otherwise.
 */
export function useIsRtl() {
  const [rtl, setRtl] = useState<boolean>(isRtl());

  useEffect(() => {
    const handle = (lng: string) => setRtl(isRtl(lng));
    i18n.on("languageChanged", handle);
    return () => {
      i18n.off("languageChanged", handle);
    };
  }, []);

  return rtl;
}
