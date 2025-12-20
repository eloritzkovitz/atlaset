import { createContext, useContext, type ReactNode } from "react";
import { MAP_OPTIONS } from "@constants";
import { useSettings } from "./SettingsContext";

interface MapUIContextType {
  projection: string;
  setProjection: (v: string) => void;
  borderColor: string;
  setBorderColor: (v: string) => void;
  borderWidth: number;
  setBorderWidth: (v: number) => void;
}

const MapUIContext = createContext<MapUIContextType | undefined>(undefined);

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

// Custom hook to use the MapUIContext
export function useMapUI() {
  const context = useContext(MapUIContext);
  if (!context) {
    throw new Error("useMapUI must be used within a MapUIProvider");
  }
  return context;
}
