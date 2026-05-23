import {
  DEFAULT_COLOR_PALETTES,
  MAP_CONFIG_OPTIONS,
} from "../../map/constants/mapSettings";
import type { Settings } from "../../types";

export const defaultSettings: Settings = {
  id: "main",
  account: { homeCountry: "", language: "en" },
  sound: {
    soundEffectsEnabled: true,
    soundEffectsVolume: 0.5,
  },
  display: { theme: "system", accent: "blue" },
  map: {
    projection: MAP_CONFIG_OPTIONS.projection[0].value,
    baseColor: MAP_CONFIG_OPTIONS.baseColor[0].value,
    borderColor: MAP_CONFIG_OPTIONS.strokeColor[0].value,
    borderWidth: MAP_CONFIG_OPTIONS.strokeWidth[0].value,
  },
  colors: {
    colorHomeCountry: false,
    colorVisitedCountries: true,
    colorUpcomingVisits: false,
    palettes: {
      standard: DEFAULT_COLOR_PALETTES.standard,
      yearly: DEFAULT_COLOR_PALETTES.yearly,
      cumulative: DEFAULT_COLOR_PALETTES.cumulative,
    },
  },
};
