import { useMemo } from "react";
import { useSettings } from "@contexts/SettingsContext";
import type { ColorMode } from "@features/atlas/shared";
import {
  DEFAULT_COLOR_PALETTES,
  type ColorsSettings,
} from "@features/settings";

/**
 * Manages color and palette configuration settings for the map.
 * @returns Current color settings and functions to update them.
 */
export function useMapColors() {
  const { settings, updateSettings } = useSettings();

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
