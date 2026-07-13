import { useMemo } from "react";
import { useSettings } from "@contexts/SettingsContext";
import { MAP_CONFIG_OPTIONS, type MapSettings } from "@features/settings";

/**
 * Manages map configuration settings.
 * @returns Current map settings and functions to update them.
 */
export function useMapSettings() {
  const { settings, updateSettings } = useSettings();

  const map = useMemo(() => settings?.map ?? {}, [settings?.map]);

  const projection = map.projection ?? MAP_CONFIG_OPTIONS.projection[0].value;
  const baseColor = map.baseColor ?? MAP_CONFIG_OPTIONS.baseColor[0].value;
  const borderColor =
    map.borderColor ?? MAP_CONFIG_OPTIONS.strokeColor[0].value;
  const borderWidth =
    map.borderWidth ?? MAP_CONFIG_OPTIONS.strokeWidth[0].value;
  const showSmallCountryOverlays = map.showSmallCountryOverlays ?? false;

  // Update functions for map settings
  const updateMapSetting = (partialNextState: Partial<MapSettings>) => {
    updateSettings({
      map: {
        ...map,
        ...partialNextState,
      },
    });
  };

  return {
    projection,
    setProjection: (v: string) => updateMapSetting({ projection: v }),
    baseColor,
    setBaseColor: (v: string) => updateMapSetting({ baseColor: v }),
    borderColor,
    setBorderColor: (v: string) => updateMapSetting({ borderColor: v }),
    borderWidth,
    setBorderWidth: (v: number) => updateMapSetting({ borderWidth: v }),
    showSmallCountryOverlays,
    setShowSmallCountryOverlays: (v: boolean) =>
      updateMapSetting({ showSmallCountryOverlays: v }),
  };
}
