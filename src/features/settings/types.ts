import type { ColorMode } from "@features/atlas/map";

/** Account-related settings. */
export type AccountSettings = {
  homeCountry: string;
  language: string;
};

/** Sound-related settings. */
export type SoundSettings = {
  soundEffectsEnabled: boolean;
  soundEffectsVolume: number;
};

/** Represents a theme key. */
export type ThemeKey = "light" | "dark" | "system";

/** Display-related settings. */
export type DisplaySettings = {
  theme: ThemeKey;
};

/** Map-related settings. */
export type MapSettings = {
  projection?: string;
  borderColor?: string;
  borderWidth?: number;
};

/** Colors-related settings. */
export type ColorsSettings = {
  colorHomeCountry: boolean;
  colorVisitedCountries: boolean;
  colorUpcomingVisits: boolean;
  palettes: Record<ColorMode, string>;
};

/** User settings. */
export type Settings = {
  id: string;
  account: AccountSettings;
  sound: SoundSettings;
  display: DisplaySettings;
  map: MapSettings;
  colors: ColorsSettings;
};
