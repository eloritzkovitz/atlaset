export type LangDef = {
  code: string;
  nativeName: string;
  isRtl?: boolean;
  priority?: number;
  flag?: string;
};

/** List of supported languages */
export const LANGUAGES: LangDef[] = [
  { code: "en", nativeName: "English", isRtl: false, priority: 10 },
  { code: "he", nativeName: "עברית", isRtl: true, priority: 20 },
];

/** Get a language definition by its code.
 * @param code - Optional language code to look up. If not provided, returns undefined.
 * @returns The language definition matching the code, or undefined if not found.
 */
export function getByCode(code?: string) {
  if (!code) return undefined;
  const base = code.split("-")[0];
  return LANGUAGES.find((l) => l.code === base);
}

/**
 * Checks if a language is right-to-left.
 * @param code - Optional language code to check. If not provided, defaults to "en".
 * @returns True if the language is RTL, false otherwise.
 */
export function isRtl(code?: string) {
  const l = getByCode(code);
  return !!l?.isRtl;
}

export const ALL_LANGUAGE_CODES = LANGUAGES.map((l) => l.code);
