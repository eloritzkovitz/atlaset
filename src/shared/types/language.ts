/** Represents a language. */
export type Language = {
  /** The ISO 639-1 code for the language.*/
  code: string;
  /** The localized name of the language, in the user's current language. */
  name?: string;
  /** The native name of the language, in its own script. */
  nativeName?: string;
  /** Indicates if the language is read from right to left. */
  isRtl?: boolean;
  /** The priority of the language. */
  priority?: number;
  /** The flag icon for the language. */
  flag?: string;
};
