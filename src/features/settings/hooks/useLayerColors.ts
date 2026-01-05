import { useSettings } from "@contexts/SettingsContext";
import { COLOR_PALETTES } from "@constants/colors";
import type { LayerMode } from "@features/atlas/layers";

/**
 * Manages layer palette settings.
 * @returns Current layer palettes and a function to set them.
 */
export function useLayerColors() {
  const { settings, updateSettings } = useSettings();

  // Home country color setting
  const colorHomeCountry = !!settings?.layers?.colorHomeCountry;
  const setColorHomeCountry = (value: boolean) =>
    updateSettings({
      layers: { ...(settings.layers ?? {}), colorHomeCountry: value },
    });

  // Upcoming visits color setting
  const colorUpcomingVisits = !!settings?.layers?.colorUpcomingVisits;
  const setColorUpcomingVisits = (value: boolean) =>
    updateSettings({
      layers: { ...(settings.layers ?? {}), colorUpcomingVisits: value },
    });

  // Fallback to an empty object if layers is undefined
  const layers = settings.layers ?? {};

  const layerPalettes = layers.palettes ?? {
    standard: COLOR_PALETTES[0].name,
    cumulative: COLOR_PALETTES[0].name,
    yearly: COLOR_PALETTES[0].name,
  };

  const setPalette = (mode: LayerMode, paletteName: string) => {
    updateSettings({
      layers: {
        ...layers,
        palettes: {
          ...layerPalettes,
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
    layerPalettes,
    setPalette,
  };
}
