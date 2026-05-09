import { type Language } from "../types/language";

/** List of supported languages */
export const LANGUAGES: Language[] = [
  { code: "en", nativeName: "English", isRtl: false, priority: 10 },
  { code: "he", nativeName: "עברית", isRtl: true, priority: 20 },
];

/** Gets a language definition by its code.
 * @param code - Optional language code to look up. If not provided, returns undefined.
 * @returns The language definition matching the code, or undefined if not found.
 */
export function getLanguageByCode(code?: string) {
  if (!code) return undefined;
  const base = code.split("-")[0];
  return LANGUAGES.find((l) => l.code === base);
}

/** Gets a list of all supported language codes. */
export const ALL_LANGUAGE_CODES = LANGUAGES.map((l) => l.code);
