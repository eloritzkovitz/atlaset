import { useMemo } from "react";
import { useSettings } from "@contexts/SettingsContext";
import type { ColorMode } from "@features/atlas/shared";
import {
  DEFAULT_COLOR_PALETTES,
  type ColorsSettings,
} from "@features/settings";

/**
 * Manages configuration settings for map layers, visibility toggles, and color palettes.
 * @returns Current layer configuration states and unified update actions.
 */
export function useLayerSettings() {
  const { settings, updateSettings } = useSettings();

  // Extract color-related settings and palettes from the global settings
  const layerColors = useMemo(() => settings?.colors ?? {}, [settings?.colors]);
  const colorPalettes = useMemo(
    () => layerColors.palettes ?? DEFAULT_COLOR_PALETTES,
    [layerColors.palettes],
  );

  // Update color settings
  const updateColorSetting = (partialNextState: Partial<ColorsSettings>) => {
    updateSettings({
      colors: {
        ...layerColors,
        ...partialNextState,
      },
    });
  };

  return {
    colorVisitedCountries: !!layerColors.colorVisitedCountries,
    setColorVisitedCountries: (value: boolean) =>
      updateColorSetting({ colorVisitedCountries: value }),
    colorHomeCountry: !!layerColors.colorHomeCountry,
    setColorHomeCountry: (value: boolean) =>
      updateColorSetting({ colorHomeCountry: value }),
    colorFutureVisits: !!layerColors.colorFutureVisits,
    setColorFutureVisits: (value: boolean) =>
      updateColorSetting({ colorFutureVisits: value }),
    colorWantToVisitCountries: !!layerColors.colorWantToVisitCountries,
    setColorWantToVisitCountries: (value: boolean) =>
      updateColorSetting({ colorWantToVisitCountries: value }),
    numAtlasColors: layerColors.numAtlasColors ?? 4,
    setNumAtlasColors: (value: number) =>
      updateColorSetting({ numAtlasColors: value }),
    colorPalettes,
    setPalette: (mode: ColorMode, paletteName: string) => {
      updateColorSetting({
        palettes: {
          ...colorPalettes,
          [mode]: paletteName,
        },
      });
    },
  };
}
