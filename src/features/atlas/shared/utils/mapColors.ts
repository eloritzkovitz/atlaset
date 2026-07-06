/**
 * Utility functions for managing map colors and palettes.
 */

import { DEFAULT_FILL_COLOR, HOME_COUNTRY_COLOR } from "@constants/colors";
import { COLOR_PALETTES } from "@constants/colorPalettes";
import { DEFAULT_COLOR_PALETTES } from "@features/settings";
import type { ColorPalette } from "@types";
import type { ColorMode, VisitColors } from "../types";

/**
 * Selects a palette object and its name given a palettes mapping and mode.
 * @param palettes - User-defined palettes mapping.
 * @param mode - Current color mode.
 * @returns The selected palette object and its name.
 */
export function getPaletteForMode(
  palettes: Record<string, string> | undefined,
  mode: ColorMode,
) {
  const paletteName = palettes?.[mode] || DEFAULT_COLOR_PALETTES[mode];
  const palette =
    COLOR_PALETTES.find((p) => p.name === paletteName) || COLOR_PALETTES[0];
  return { palette, paletteName };
}

/**
 * Generates visit colors based on a given color palette.
 * @param palette - The color palette to extract roles from.
 * @param baseColor - The base color for the map.
 * @returns VisitColors object containing colors for home country, visit counts, and yearly roles.
 */
export function getVisitColorsFromPalette(
  palette: ColorPalette,
  baseColor: string,
): VisitColors {
  const colors = palette.colors;
  const reversedVisitCounts = [...colors].reverse();

  return {
    base: baseColor,
    home: HOME_COUNTRY_COLOR,
    visitCounts: reversedVisitCounts,
    yearly: {
      new: colors[0] || baseColor,
      revisit: colors[1] || colors[0] || baseColor,
      previous: colors[2] || colors[1] || baseColor,
      upcoming: colors[3] || colors[2] || baseColor,
      upcomingRevisit: colors[4] || colors[3] || baseColor,
    },
  };
}

/** Maps a palette to the country color constants shape.
 * @param palette - The color palette to map.
 * @returns An object containing the country colors based on the palette.
 */
export function mapPaletteToCountryColors(palette: { colors: string[] }) {
  const colors = palette.colors;

  return {
    HOME_COUNTRY_COLOR: HOME_COUNTRY_COLOR,
    HOVERED_COUNTRY_COLOR: colors[0] || DEFAULT_FILL_COLOR,
    VISITED_COUNTRY_COLOR: colors[1] || colors[0] || DEFAULT_FILL_COLOR,
    FUTURE_VISIT_COUNTRY_COLOR: colors[2] || colors[1] || DEFAULT_FILL_COLOR,
    SELECTED_COUNTRY_COLOR: colors[3] || colors[2] || DEFAULT_FILL_COLOR,
    HIGHLIGHTED_COUNTRY_COLOR: colors[4] || colors[3] || DEFAULT_FILL_COLOR,
  };
}

/**
 * Gets the color for a country based on visit count and mode.
 * @param count - The number of visits to the country.
 * @param isHome - Whether the country is the home country.
 * @param defaultFill - The default fill color for unvisited countries.
 * @param mode - The visit color mode ("cumulative" or "yearly").
 * @param palette - The VisitColors palette to use.
 * @param timelineFlags - Optional flags indicating the timeline status of the country.
 * @returns The color string for the country based on the provided parameters.
 */
export function getVisitColor(
  count: number,
  isHome: boolean,
  defaultFill: string,
  mode: ColorMode = "cumulative",
  palette: VisitColors,
  timelineFlags?: {
    isNewThisYear?: boolean;
    isRevisitThisYear?: boolean;
    isUpcomingVisit?: boolean;
    isUpcomingRevisit?: boolean;
  },
): string {
  if (isHome) return palette.home;

  if (mode === "yearly") {
    if (timelineFlags?.isUpcomingRevisit) return palette.yearly.upcomingRevisit;
    if (timelineFlags?.isUpcomingVisit) return palette.yearly.upcoming;
    if (timelineFlags?.isRevisitThisYear) return palette.yearly.revisit;
    if (timelineFlags?.isNewThisYear) return palette.yearly.new;
    if (count === 0) return defaultFill;
    return palette.yearly.previous;
  }

  // For cumulative mode, use the visitCounts array to determine the color based on count
  if (count <= 0) return defaultFill;

  const colorIndex = Math.min(count - 1, palette.visitCounts.length - 1);
  return palette.visitCounts[colorIndex] || defaultFill;
}
