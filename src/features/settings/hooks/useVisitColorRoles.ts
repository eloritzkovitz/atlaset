import { useSettings } from "@contexts/SettingsContext";
import { COLOR_PALETTES } from "@constants/colors";
import type { LayerMode } from "@features/atlas/layers";
import { getVisitColorRolesFromPalette } from "@features/visits";
import type { VisitColorRoles } from "@types";

/**
 * Gets visit color roles based on the selected layer palette for a given mode.
 * @param mode - Current layer mode.
 * @returns Visit color roles corresponding to the selected palette.
 */
export function useVisitColorRoles(mode: LayerMode): VisitColorRoles {
  const { settings } = useSettings();

  // Fallbacks to prevent undefined errors
  const colors = settings.colors ?? {};
  const palettes = colors.palettes ?? {};

  const paletteName = palettes[mode] || COLOR_PALETTES[0].name;
  const palette =
    COLOR_PALETTES.find((p) => p.name === paletteName) || COLOR_PALETTES[0];

  return getVisitColorRolesFromPalette(palette);
}
