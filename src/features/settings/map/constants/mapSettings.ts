import {
  MAP_BG_COLOR,
  MAP_BORDER_COLOR_DARK,
  MAP_BORDER_COLOR_GRAY,
  MAP_BORDER_COLOR_LIGHT,
} from "@constants/colors";
import { COLOR_PALETTES } from "@constants/colorPalettes";
import type { ColorMode } from "@features/atlas/map/types";

/** Map configuration options. */
export const MAP_CONFIG_OPTIONS = {
  projection: [
    { value: "geoNaturalEarth1", label: "Natural Earth" },
    { value: "geoEqualEarth", label: "Equal Earth" },
    { value: "geoMercator", label: "Mercator" },
  ],
  strokeColor: [
    { value: MAP_BORDER_COLOR_DARK, label: "Dark" },
    { value: MAP_BORDER_COLOR_LIGHT, label: "Light" },
    { value: MAP_BORDER_COLOR_GRAY, label: "Gray" },
  ],
  strokeWidth: [
    { value: 0.1, label: "Thin" },
    { value: 0.5, label: "Medium" },
    { value: 1, label: "Thick" },
  ],
};

/* Default map settings. */
export const DEFAULT_MAP_SETTINGS = {
  geoUrl: import.meta.env.VITE_MAP_GEO_URL || "/data/countries.geojson",
  projection: MAP_CONFIG_OPTIONS.projection[0].value,
  scaleDivisor: 2.8,
  minZoom: 1,
  maxZoom: 20,
  bgColor: MAP_BG_COLOR,
};

/** Map geography style options. */
export const MAP_GEOGRAPHY_STYLE = {
  default: {
    fill: MAP_BG_COLOR,
    stroke: MAP_CONFIG_OPTIONS.strokeColor[0].value,
    strokeWidth: MAP_CONFIG_OPTIONS.strokeWidth[0].value,
    outline: "none",
    cursor: "pointer",
  },
};

/* Default color palettes. */
export const DEFAULT_COLOR_PALETTES: Record<ColorMode, string> = {
  standard: COLOR_PALETTES[0].name,
  cumulative: COLOR_PALETTES[0].name,
  yearly: COLOR_PALETTES[0].name,
};
