import type { OverlayMode } from "@features/atlas/overlays";

/** Account-related settings */
export type AccountSettings = {
  homeCountry: string;
};

/** Sound-related settings */
export type SoundSettings = {
  soundEffectsEnabled: boolean;
  soundEffectsVolume: number;
};

/** Display-related settings */
export type DisplaySettings = {
  theme: "light" | "dark";
};

/** Map-related settings */
export type MapSettings = {
  projection?: string;
  borderColor?: string;
  borderWidth?: number;
};

/** Overlay-related settings */
export type OverlaySettings = {
  colorHomeCountry: boolean;
  palettes: Record<OverlayMode, string>;
};

/** User settings. */
export type Settings = {
  id: string;
  account: AccountSettings;
  sound: SoundSettings;
  display: DisplaySettings;
  map: MapSettings;
  overlays: OverlaySettings;  
};
