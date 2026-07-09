import type { ColorMode } from "@features/atlas/shared";

/** Language and region-related settings. */
export type LanguageRegionSettings = {
  language: string;
  dateLocale?: string | null;
  homeCountry: string;
};

/** Sound-related settings. */
export type SoundSettings = {
  soundEffectsEnabled: boolean;
  soundEffectsVolume: number;
};

/** Represents a theme key. */
export type ThemeKey = "light" | "dark" | "system";

/** Represents an accent key. */
export type AccentKey = "blue" | "indigo" | "teal" | "green" | "amber" | "rose";

/** Display-related settings. */
export type DisplaySettings = {
  theme: ThemeKey;
  accent?: AccentKey;
};

/** Accessibility-related settings. */
export type AccessibilitySettings = {
  singleKeyShortcutsEnabled: boolean;
};

/** Map-related settings. */
export type MapSettings = {
  projection?: string;
  baseColor?: string;
  borderColor?: string;
  borderWidth?: number;
};

/** Colors-related settings. */
export type ColorsSettings = {
  colorHomeCountry: boolean;
  colorVisitedCountries: boolean;
  colorFutureVisits: boolean;
  colorWantToVisitCountries: boolean;
  numAtlasColors: number;
  palettes: Record<ColorMode, string>;
};

/** User settings. */
export type Settings = {
  id: string;
  account: LanguageRegionSettings;
  sound: SoundSettings;
  display: DisplaySettings;
  accessibility: AccessibilitySettings;
  map: MapSettings;
  colors: ColorsSettings;
};
