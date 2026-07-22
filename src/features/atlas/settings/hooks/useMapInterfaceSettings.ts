import { useMemo } from "react";
import { useSettings } from "@contexts/SettingsContext";
import { type MapInterfaceSettings } from "@features/settings";

/**
 * Manages map interface settings.
 * @returns Current map interface settings and functions to update them.
 */
export function useMapInterfaceSettings() {
  const { settings, updateSettings } = useSettings();

  const interfaceSettings = useMemo(
    () => settings?.map?.interface ?? {},
    [settings?.map?.interface],
  );

  const toolbarOrientation = interfaceSettings.toolbarOrientation ?? "vertical";

  // Update function for map interface settings
  const updateInterfaceSetting = (
    partialNextState: Partial<MapInterfaceSettings>,
  ) => {
    if (!settings?.map) return;

    updateSettings({
      map: {
        ...settings.map,
        interface: {
          ...settings.map.interface,
          ...partialNextState,
        },
      },
    });
  };

  return {
    toolbarOrientation,
    setToolbarOrientation: (v: "horizontal" | "vertical") =>
      updateInterfaceSetting({ toolbarOrientation: v }),
  };
}
