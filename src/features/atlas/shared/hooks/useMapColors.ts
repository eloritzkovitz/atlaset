import { useMemo } from "react";
import { useSettings } from "@contexts/SettingsContext";
import { MAP_CONFIG_OPTIONS } from "@features/settings";
import type { ColorMode, VisitColors } from "../types";
import {
  getPaletteForMode,
  mapPaletteToCountryColors,
  getVisitColorsFromPalette,
} from "../utils/mapColors";

/**
 * Returns a set of map colors based on the current color mode and user settings.
 * @param mode - The current operational color mode.
 * @returns An object containing country colors and visit color roles.
 */
export function useMapColors(mode?: ColorMode) {
  const { settings } = useSettings();

  return useMemo(() => {
    const baseColor =
      settings?.map?.baseColor ?? MAP_CONFIG_OPTIONS.baseColor[0].value;
    const palettes = settings?.colors?.palettes ?? {};

    // Get palettes for standard mode and the current mode
    const { palette: standardPalette } = getPaletteForMode(
      palettes,
      "standard",
    );
    const { palette: currentModePalette } = getPaletteForMode(
      palettes,
      mode ?? "standard",
    );

    // Map the palettes to country colors and visit color roles
    const countryColors = mapPaletteToCountryColors(standardPalette);
    const visitColors: VisitColors = getVisitColorsFromPalette(
      currentModePalette,
      baseColor,
    );

    return {
      ...countryColors,
      visitColors,
    };
  }, [settings?.colors?.palettes, settings?.map?.baseColor, mode]);
}
