import { useMemo } from "react";
import { useMapColors, useMapSettings } from "@features/atlas/settings";
import { MAP_GEOGRAPHY_STYLE } from "@features/settings";
import type { ColorMode, VisitColors } from "../types";
import {
  getPaletteForMode,
  mapPaletteToCountryColors,
  getVisitColorsFromPalette,
} from "../utils/mapColors";

interface UseMapColorsOptions {
  mode?: ColorMode;
}

/**
 * Returns map styles and colors based on the current color mode and user settings.
 * @param mode - The current operational color mode.
 * @returns An object containing country colors and visit color roles.
 */
export function useMapTheme({ mode }: UseMapColorsOptions = {}) {
  const { colorPalettes } = useMapColors();
  const { baseColor, borderColor, borderWidth } = useMapSettings();

  // Get the appropriate color palette for the current mode and map settings
  return useMemo(() => {
    const { palette: standardPalette } = getPaletteForMode(
      colorPalettes,
      "standard",
    );
    const { palette: currentModePalette } = getPaletteForMode(
      colorPalettes,
      mode ?? "standard",
    );

    // Map the palettes to country colors and visit color roles
    const countryColors = mapPaletteToCountryColors(standardPalette);
    const visitColors: VisitColors = getVisitColorsFromPalette(
      currentModePalette,
      baseColor,
    );

    // Define geography styles for different interaction states
    const baseStyle = {
      ...MAP_GEOGRAPHY_STYLE.default,
      fill: baseColor,
      stroke: borderColor,
      strokeWidth: borderWidth,
    };

    const geographyStyle = {
      default: baseStyle,
      highlight: {
        ...baseStyle,
        fill: countryColors.HIGHLIGHTED_COUNTRY_COLOR,
      },
      hover: { ...baseStyle, fill: countryColors.HOVERED_COUNTRY_COLOR },
      pressed: { ...baseStyle, fill: countryColors.SELECTED_COUNTRY_COLOR },
    };

    return {
      geographyStyle,
      ...countryColors,
      visitColors,
    };
  }, [baseColor, borderColor, borderWidth, colorPalettes, mode]);
}
