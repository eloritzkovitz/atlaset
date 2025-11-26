import { useSettings } from "@contexts/SettingsContext";
import { COLOR_PALETTES } from "@constants/colors";
import { getVisitColorRolesFromPalette } from "@features/visits";
import type { OverlayMode, VisitColorRoles } from "@types";

/**
 * Gets visit color roles based on the selected overlay palette for a given mode.
 * @param mode - Current overlay mode.
 * @returns Visit color roles corresponding to the selected palette.
 */
export function useVisitColorRoles(mode: OverlayMode): VisitColorRoles {
  const { settings } = useSettings();
  const paletteName =
    settings.overlayPalettes?.[mode] || COLOR_PALETTES[0].name;
  const palette =
    COLOR_PALETTES.find((p) => p.name === paletteName) || COLOR_PALETTES[0];
  return getVisitColorRolesFromPalette(palette);
}
