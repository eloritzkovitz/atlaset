import { useMemo } from "react";
import { useSettings } from "@contexts/SettingsContext";
import {
  MAP_CONFIG_OPTIONS,
  type MapConfigurationSettings,
} from "@features/settings";

/**
 * Manages map configuration settings.
 * @returns Current map settings and functions to update them.
 */
export function useMapSettings() {
  const { settings, updateSettings } = useSettings();

  const configSettings = useMemo(
    () => settings?.map?.configuration ?? {},
    [settings?.map?.configuration],
  );

  const projection =
    configSettings.projection ?? MAP_CONFIG_OPTIONS.projection[0].value;
  const baseColor =
    configSettings.baseColor ?? MAP_CONFIG_OPTIONS.baseColor[0].value;
  const borderColor =
    configSettings.borderColor ?? MAP_CONFIG_OPTIONS.strokeColor[0].value;
  const borderWidth =
    configSettings.borderWidth ?? MAP_CONFIG_OPTIONS.strokeWidth[0].value;

  // Update functions for map settings
  const updateConfigSetting = (
    partialNextState: Partial<MapConfigurationSettings>,
  ) => {
    if (!settings?.map) return;

    updateSettings({
      map: {
        ...settings.map,
        configuration: {
          ...settings.map.configuration,
          ...partialNextState,
        },
      },
    });
  };

  return {
    projection,
    setProjection: (v: string) => updateConfigSetting({ projection: v }),
    baseColor,
    setBaseColor: (v: string) => updateConfigSetting({ baseColor: v }),
    borderColor,
    setBorderColor: (v: string) => updateConfigSetting({ borderColor: v }),
    borderWidth,
    setBorderWidth: (v: number) => updateConfigSetting({ borderWidth: v }),
  };
}
