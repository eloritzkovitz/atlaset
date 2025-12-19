import type { OverlayMode } from "@types";

export type DisplaySettings = {
  theme: "light" | "dark";
};

export type MapSettings = {
  projection?: string;
  borderColor?: string;
  borderWidth?: number;
};

export type OverlaySettings = {
  colorHomeCountry: boolean;
  palettes: Record<OverlayMode, string>;
};

export type Settings = {
  id: string;
  homeCountry: string;
  display: DisplaySettings;
  map: MapSettings;
  overlays: OverlaySettings;
};
