import { createContext, useContext } from "react";
import type { MapContextValue } from "./MapProvider";

export const MapContext = createContext<MapContextValue | undefined>(undefined);

export function useMapContext() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMapContext must be used within a MapProvider");
  return ctx;
}
