import type { LayerMode } from "@features/atlas/layers";

/** Account-related settings. */
export type AccountSettings = {
  homeCountry: string;
};

/** Sound-related settings. */
export type SoundSettings = {
  soundEffectsEnabled: boolean;
  soundEffectsVolume: number;
};

/** Display-related settings. */
export type DisplaySettings = {
  theme: "light" | "dark";
};

/** Map-related settings */
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
  palettes: Record<LayerMode, string>;
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
