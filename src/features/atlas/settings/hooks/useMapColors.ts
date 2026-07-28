import { useMemo } from "react";
import type { ColorMode } from "@features/atlas/core";
import { DEFAULT_COLOR_PALETTES, useSettings } from "@features/settings";
import type { MapColorsSettings } from "../types";

/**
 * Manages color and palette configuration settings for the map.
 * @returns Current color settings and functions to update them.
 */
export function useMapColors() {
  const { settings, updateSettings } = useSettings();

  const layerColors = useMemo(
    () => settings?.map?.colors ?? {},
    [settings?.map?.colors],
  );

  const colorPalettes = useMemo(
    () => layerColors.palettes ?? DEFAULT_COLOR_PALETTES,
    [layerColors.palettes],
  );

  // Updates the map color settings with the provided partial state.
  const updateColorSetting = (partialNextState: Partial<MapColorsSettings>) => {
    if (!settings?.map) return;

    updateSettings({
      map: {
        ...settings.map,
        colors: {
          ...settings.map.colors,
          ...partialNextState,
        },
      },
    });
  };

  return {
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
