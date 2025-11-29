import type { Settings } from "@types";

export const defaultSettings: Settings = {
  id: "main",
  homeCountry: "",
  colorHomeCountry: false,
  theme: "light",
  overlayPalettes: {
    standard: "Default",
    yearly: "Default",
    cumulative: "Default",
  },
};
