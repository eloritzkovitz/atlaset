import { useSettings } from "@contexts/SettingsContext";
import { COLOR_PALETTES } from "@constants/colors";
import type { OverlayMode } from "@types";

/**
 * Manages overlay palette settings.
 * @returns Current overlay palettes and a function to set them.
 */
export function useOverlayColors() {
  const { settings, updateSettings } = useSettings();

  // Fallback to false if overlays or colorHomeCountry is undefined
  const colorHomeCountry = !!settings?.overlays?.colorHomeCountry;
  const setColorHomeCountry = (value: boolean) =>
    updateSettings({
      overlays: { ...(settings.overlays ?? {}), colorHomeCountry: value },
    });

  // Fallback to an empty object if overlays is undefined
  const overlays = settings.overlays ?? {};

  const overlayPalettes = overlays.palettes ?? {
    standard: COLOR_PALETTES[0].name,
    cumulative: COLOR_PALETTES[0].name,
    yearly: COLOR_PALETTES[0].name,
  };

  const setPalette = (mode: OverlayMode, paletteName: string) => {
    updateSettings({
      overlays: {
        ...overlays,
        palettes: {
          ...overlayPalettes,
          [mode]: paletteName,
        },
      },
    });
  };

  return { colorHomeCountry, setColorHomeCountry, overlayPalettes, setPalette };
}
