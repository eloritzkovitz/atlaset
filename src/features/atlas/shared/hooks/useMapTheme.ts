import { useMemo } from "react";
import { useMapView } from "@contexts/MapViewContext";
import { useSettings } from "@contexts/SettingsContext";
import { MAP_GEOGRAPHY_STYLE } from "@features/settings";
import type { ColorMode, VisitColors } from "../types";
import {
  getPaletteForMode,
  mapPaletteToCountryColors,
  getVisitColorsFromPalette,
} from "../utils/mapColors";

interface UseMapColorsOptions {
  mode?: ColorMode;
  isAddingMarker?: boolean;
}

/**
 * Returns map styles and colors based on the current color mode and user settings.
 * @param mode - The current operational color mode.
 * @param isAddingMarker - Optional boolean indicating if a marker is being added.
 * @returns An object containing country colors and visit color roles.
 */
export function useMapTheme({
  mode,
  isAddingMarker,
}: UseMapColorsOptions = {}) {
  const { baseColor, borderColor, borderWidth } = useMapView();
  const { settings } = useSettings();

  return useMemo(() => {
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

    const cursor = isAddingMarker ? "crosshair" : "pointer";

    // Define geography styles for different interaction states
    const baseStyle = {
      ...MAP_GEOGRAPHY_STYLE.default,
      fill: baseColor,
      stroke: borderColor,
      strokeWidth: borderWidth,
      cursor,
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
  }, [
    baseColor,
    borderColor,
    borderWidth,
    settings?.colors?.palettes,
    mode,
    isAddingMarker,
  ]);
}
