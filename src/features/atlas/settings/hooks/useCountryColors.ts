import { useSettings } from "@contexts/SettingsContext";
import {
  getPaletteForMode,
  mapPaletteToCountryColors,
} from "../utils/mapColors";

/**
 * Returns country colors based on user-selected palette.
 * @returns Country colors for different states.
 */
export function useCountryColors() {
  const { settings } = useSettings();
  const palettes = settings.colors?.palettes;
  const { palette } = getPaletteForMode(palettes, "standard");

  return mapPaletteToCountryColors(palette);
}
