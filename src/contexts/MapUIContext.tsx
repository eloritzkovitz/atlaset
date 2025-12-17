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
};

const MapUIContext = createContext<MapUIContextType | undefined>(undefined);

export function MapUIProvider({ children }: { children: ReactNode }) {
  const { settings, updateSettings } = useSettings();

  // Fallbacks if settings are not yet loaded
  const projection = settings.projection ?? MAP_OPTIONS.projection[0].value;
  const borderColor = settings.borderColor ?? MAP_OPTIONS.strokeColor[0].value;
  const borderWidth = settings.borderWidth ?? MAP_OPTIONS.strokeWidth[0].value;

  const setProjection = (v: string) => updateSettings({ projection: v });
  const setBorderColor = (v: string) => updateSettings({ borderColor: v });
  const setBorderWidth = (v: number) => updateSettings({ borderWidth: v });

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
