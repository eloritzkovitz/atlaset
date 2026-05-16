import { LANGUAGES } from "@constants/languages";

/**
 * Maps the list of languages to include localized names based on the provided translation function.
 * @param t - Translation function to get localized language names.
 * @returns An array of languages with code, native name, and localized name.
 */
export function mapLanguages(t: (key: string) => string | undefined) {
  return LANGUAGES.slice()
    .sort((a, b) => (a.priority || 999) - (b.priority || 999))
    .map((l) => ({
      code: l.code,
      native: l.nativeName,
      localized: t(`languages:${l.code}`) || "",
    }));
}

/**
 * Generates options for a language select input based on the available languages and a translation function.
 * @param t - Translation function to get localized language names.
 * @return An array of options with value and label for each language.
 */
export function languageOptions(t: (key: string) => string | undefined) {
  return mapLanguages(t).map((l) => ({
    value: l.code,
    label: l.localized ? `${l.native} (${l.localized})` : l.native,
  }));
}
