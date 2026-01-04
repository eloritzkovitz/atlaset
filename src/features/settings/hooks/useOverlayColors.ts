import { useSettings } from "@contexts/SettingsContext";
import { COLOR_PALETTES } from "@constants/colors";
import type { OverlayMode } from "@features/atlas/overlays";

/**
 * Manages overlay palette settings.
 * @returns Current overlay palettes and a function to set them.
 */
export function useOverlayColors() {
  const { settings, updateSettings } = useSettings();

  // Home country color setting
  const colorHomeCountry = !!settings?.overlays?.colorHomeCountry;
  const setColorHomeCountry = (value: boolean) =>
    updateSettings({
      overlays: { ...(settings.overlays ?? {}), colorHomeCountry: value },
    });

  // Upcoming visits color setting
  const colorUpcomingVisits = !!settings?.overlays?.colorUpcomingVisits;
  const setColorUpcomingVisits = (value: boolean) =>
    updateSettings({
      overlays: { ...(settings.overlays ?? {}), colorUpcomingVisits: value },
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

  return {
    colorHomeCountry,
    setColorHomeCountry,
    colorUpcomingVisits,
    setColorUpcomingVisits,
    overlayPalettes,
    setPalette,
  };
}
