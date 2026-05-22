/**
 * Utility functions for managing map colors and palettes.
 */

import { HOME_COUNTRY_COLOR } from "@constants/colors";
import { COLOR_PALETTES } from "@constants/colorPalettes";
import type { ColorMode } from "@features/atlas/map";
import type { ColorPalette, VisitColorRoles } from "@types";
import { DEFAULT_COLOR_PALETTES } from "../constants/mapSettings";

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
 * @returns VisitColorRoles object containing colors for home country, visit counts, and yearly roles.
 */
export function getVisitColorRolesFromPalette(
  palette: ColorPalette,
): VisitColorRoles {
  return {
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
    SELECTED_COUNTRY_COLOR: palette.colors[2],
    UPCOMING_VISIT_COUNTRY_COLOR: palette.colors[3],
    HIGHLIGHTED_COUNTRY_COLOR: palette.colors[4],
  };
}
