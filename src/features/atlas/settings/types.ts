import type { ColorMode } from "../core/types";

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
