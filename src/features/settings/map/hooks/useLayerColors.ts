import { useSettings } from "@contexts/SettingsContext";
import type { ColorMode } from "@features/atlas/map";
import { DEFAULT_COLOR_PALETTES } from "../constants/mapSettings";

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

  // Palette settings
  const colors = settings.colors ?? {};
  const colorPalettes = colors.palettes ?? DEFAULT_COLOR_PALETTES;

  const setPalette = (mode: ColorMode, paletteName: string) => {
    updateSettings({
      colors: {
        ...colors,
        palettes: {
          ...colorPalettes,
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
    colorPalettes,
    setPalette,
  };
}
