import type { ColorMode } from "@features/atlas/shared";

/** Language and region-related settings. */
export type LanguageRegionSettings = {
  language: string;
  dateLocale?: string | null;
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
  animationsEnabled: boolean;
};

/** Privacy-related settings. */
export type PrivacySettings = {
  analyticsConsent: boolean | null;
};

/** Represents map configuration settings. */
export type MapConfigurationSettings = {
  projection?: string;
  baseColor?: string;
  borderColor?: string;
  borderWidth?: number;
};

/** Represents map interface and layout settings. */
export type MapInterfaceSettings = {
  toolbarOrientation: "horizontal" | "vertical";
};

/** Represents map overlay settings. */
export type MapOverlaySettings = {
  showSmallCountryOverlays: boolean;
  includeIntegralRegions: boolean;
  showHomeCountry: boolean;
  showVisitedCountries: boolean;
  showFutureVisits: boolean;
  showWantToVisitCountries: boolean;
};

/** Represents map color settings. */
export type MapColorsSettings = {
  numAtlasColors: number;
  palettes: Record<ColorMode, string>;
};

/** Represents map-related settings. */
export type MapSettings = {
  configuration: MapConfigurationSettings;
  interface: MapInterfaceSettings;
  overlays: MapOverlaySettings;
  colors: MapColorsSettings;
};

/** Represents the overall settings object. */
export type Settings = {
  id: string;
  localization: LanguageRegionSettings;
  sound: SoundSettings;
  display: DisplaySettings;
  accessibility: AccessibilitySettings;
  privacy: PrivacySettings;
  map: MapSettings;
};
