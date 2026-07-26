/** Represents a theme key. */
export type ThemeKey = "light" | "dark" | "system";

/** Represents an accent key. */
export type AccentKey = "blue" | "indigo" | "teal" | "green" | "amber" | "rose";

/** Display-related settings. */
export type DisplaySettings = {
  theme: ThemeKey;
  accent?: AccentKey;
};
