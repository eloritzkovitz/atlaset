import {
  DEFAULT_MAP_SETTINGS,
  MAP_OPTIONS,
} from "@features/atlas/map/constants/map";
import type { Settings } from "../types";

export const defaultSettings: Settings = {
  id: "main",
  account: { homeCountry: "", language: "en" },
  sound: {
    soundEffectsEnabled: true,
    soundEffectsVolume: 0.5,
  },
  display: { theme: "dark" },
  map: {
    projection: DEFAULT_MAP_SETTINGS.projection,
    borderColor: MAP_OPTIONS.strokeColor[0].value,
    borderWidth: MAP_OPTIONS.strokeWidth[0].value,
  },
  colors: {
    colorHomeCountry: false,
    colorVisitedCountries: true,
    colorUpcomingVisits: false,
    palettes: {
      standard: "Default",
      yearly: "Default",
      cumulative: "Default",
    },
  },
};
