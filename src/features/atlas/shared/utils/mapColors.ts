/**
 * Utility functions for managing map colors and palettes.
 */

import { HOME_COUNTRY_COLOR } from "@constants/colors";
import { COLOR_PALETTES } from "@constants/colorPalettes";
import { DEFAULT_COLOR_PALETTES } from "@features/settings";
import type { ColorPalette } from "@types";
import type { ColorMode, VisitColorRoles } from "../types";

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
 * Generates visit color roles based on a given color palette.
 * @param palette - The color palette to extract roles from.
 * @param baseColor - The base color for the map.
 * @returns VisitColorRoles object containing colors for home country, visit counts, and yearly roles.
 */
export function getVisitColorRolesFromPalette(
  palette: ColorPalette,
  baseColor: string,
): VisitColorRoles {
  return {
    base: baseColor,
    home: HOME_COUNTRY_COLOR,
    visitCounts: [...palette.colors].reverse(),
    yearly: {
      new: palette.colors[0],
      revisit: palette.colors[1],
      previous: palette.colors[2],
      upcoming: palette.colors[3],
      upcomingRevisit: palette.colors[4],
    },
  };
}

/** Maps a palette to the country color constants shape.
 * @param palette - The color palette to map.
 * @returns An object containing the country colors based on the palette.
 */
export function mapPaletteToCountryColors(palette: { colors: string[] }) {
  return {
    HOME_COUNTRY_COLOR: HOME_COUNTRY_COLOR,
    HOVERED_COUNTRY_COLOR: palette.colors[0],
    VISITED_COUNTRY_COLOR: palette.colors[1],
    FUTURE_VISIT_COUNTRY_COLOR: palette.colors[2],
    SELECTED_COUNTRY_COLOR: palette.colors[3],
    HIGHLIGHTED_COUNTRY_COLOR: palette.colors[4],
  };
}

/**
 * Gets the color for a country based on visit count and mode.
 * @param count - The number of visits to the country.
 * @param isHome - Whether the country is the home country.
 * @param defaultFill - The default fill color for unvisited countries.
 * @param mode - The visit color mode ("cumulative" or "yearly").
 * @param palette - The VisitColorRoles palette to use.
 * @param isNewThisYear - Whether the visit is new this year (yearly mode).
 * @param isRevisitThisYear - Whether the visit is a revisit this year (yearly mode).
 * @param isUpcomingVisit - Whether the visit is an upcoming visit (yearly mode).
 * @param isUpcomingRevisit - Whether the visit is an upcoming revisit (yearly mode).
 * @returns The color string for the country based on the provided parameters.
 */
export function getVisitColor(
  count: number,
  isHome: boolean,
  defaultFill: string,
  mode: ColorMode = "cumulative",
  palette: VisitColorRoles,
  timelineFlags?: {
    isNewThisYear?: boolean;
    isRevisitThisYear?: boolean;
    isUpcomingVisit?: boolean;
    isUpcomingRevisit?: boolean;
  },
): string {
  if (isHome) return palette.home;

  if (mode === "cumulative") {
    if (count <= 0) return defaultFill;
    const colorIndex = Math.min(count - 1, palette.visitCounts.length - 1);
    return palette.visitCounts[colorIndex] || defaultFill;
  }

  if (mode === "yearly") {
    if (timelineFlags?.isUpcomingRevisit) return palette.yearly.upcomingRevisit;
    if (timelineFlags?.isUpcomingVisit) return palette.yearly.upcoming;
    if (timelineFlags?.isRevisitThisYear) return palette.yearly.revisit;
    if (timelineFlags?.isNewThisYear) return palette.yearly.new;
    if (count === 0) return defaultFill;
    return palette.yearly.previous;
  }

  return defaultFill;
}
