import { useSettings } from "@contexts/SettingsContext";
import type { ColorMode } from "@features/atlas/map";
import type { VisitColorRoles } from "@types";
import {
  getPaletteForMode,
  getVisitColorRolesFromPalette,
} from "../utils/mapColors";

/**
 * Gets visit color roles based on the selected color palette for a given mode.
 * @param mode - Current color mode.
 * @returns Visit color roles corresponding to the selected palette.
 */
export function useVisitColorRoles(mode: ColorMode): VisitColorRoles {
  const { settings } = useSettings();
  const colors = settings.colors ?? {};
  const palettes = colors.palettes ?? {};

  const { palette } = getPaletteForMode(palettes, mode);

  return getVisitColorRolesFromPalette(palette);
}
