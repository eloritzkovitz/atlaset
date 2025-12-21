import { createContext, useContext } from "react";

export interface MapUIContextType {
  projection: string;
  setProjection: (v: string) => void;
  borderColor: string;
  setBorderColor: (v: string) => void;
  borderWidth: number;
  setBorderWidth: (v: number) => void;
}

export const MapUIContext = createContext<MapUIContextType | undefined>(undefined);

export function useMapUI() {
  const context = useContext(MapUIContext);
  if (!context) {
    throw new Error("useMapUI must be used within a MapUIProvider");
  }
  return context;
}
