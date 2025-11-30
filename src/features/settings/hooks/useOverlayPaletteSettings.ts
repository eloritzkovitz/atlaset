import { useSettings } from "@contexts/SettingsContext";
import { COLOR_PALETTES } from "@constants/colors";
import type { OverlayMode } from "@types";

/**
 * Manages overlay palette settings.
 * @returns Current overlay palettes and a function to set them.
 */
export function useOverlayPaletteSettings() {
  const { settings, updateSettings } = useSettings();

  const overlayPalettes = settings.overlayPalettes ?? {
    standard: COLOR_PALETTES[0].name,
    cumulative: COLOR_PALETTES[0].name,
    yearly: COLOR_PALETTES[0].name,
  };

  const setPalette = (mode: OverlayMode, paletteName: string) => {
    updateSettings({
      overlayPalettes: {
        ...overlayPalettes,
        [mode]: paletteName,
      },
    });    
  };

  return { overlayPalettes, setPalette };
}
