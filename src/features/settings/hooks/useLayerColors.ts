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
  const colorHomeCountry = !!settings?.colors?.colorHomeCountry;
  const setColorHomeCountry = (value: boolean) =>
    updateSettings({
      colors: { ...(settings.colors ?? {}), colorHomeCountry: value },
    });

  // Visited countries color setting
  const colorVisitedCountries = !!settings?.colors?.colorVisitedCountries;
  const setColorVisitedCountries = (value: boolean) =>
    updateSettings({
      colors: { ...(settings.colors ?? {}), colorVisitedCountries: value },
    });

  // Upcoming visits color setting
  const colorUpcomingVisits = !!settings?.colors?.colorUpcomingVisits;
  const setColorUpcomingVisits = (value: boolean) =>
    updateSettings({
      colors: { ...(settings.colors ?? {}), colorUpcomingVisits: value },
    });

  // Fallback to an empty object if layers is undefined
  const colors = settings.colors ?? {};

  const layerPalettes = colors.palettes ?? {
    standard: COLOR_PALETTES[0].name,
    cumulative: COLOR_PALETTES[0].name,
    yearly: COLOR_PALETTES[0].name,
  };

  const setPalette = (mode: LayerMode, paletteName: string) => {
    updateSettings({
      colors: {
        ...colors,
        palettes: {
          ...layerPalettes,
          [mode]: paletteName,
        },
      },
    });
  };

  return {
    colorVisitedCountries,
    setColorVisitedCountries,
    colorHomeCountry,
    setColorHomeCountry,
    colorUpcomingVisits,
    setColorUpcomingVisits,
    layerPalettes,
    setPalette,
  };
}
