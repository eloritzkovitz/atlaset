
import { type ReactNode } from "react";
import { MAP_OPTIONS } from "@constants";
import { useSettings } from "./SettingsContext";
import { MapUIContext } from "./MapUIContext";

export function MapUIProvider({ children }: { children: ReactNode }) {
  const { settings, updateSettings } = useSettings();

  // Ensure settings.map is always defined
  const map = settings.map ?? {
    projection: undefined,
    borderColor: undefined,
    borderWidth: undefined,
  };

  const projection = map.projection ?? MAP_OPTIONS.projection[0].value;
  const borderColor = map.borderColor ?? MAP_OPTIONS.strokeColor[0].value;
  const borderWidth = map.borderWidth ?? MAP_OPTIONS.strokeWidth[0].value;

  const setProjection = (v: string) =>
    updateSettings({ map: { ...map, projection: v } });
  const setBorderColor = (v: string) =>
    updateSettings({ map: { ...map, borderColor: v } });
  const setBorderWidth = (v: number) =>
    updateSettings({ map: { ...map, borderWidth: v } });

  return (
    <MapUIContext.Provider
      value={{
        projection,
        setProjection,
        borderColor,
        setBorderColor,
        borderWidth,
        setBorderWidth,
      }}
    >
      {children}
    </MapUIContext.Provider>
  );
}

