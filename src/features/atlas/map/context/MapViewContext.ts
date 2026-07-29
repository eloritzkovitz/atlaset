import { createContext, useContext } from "react";
import type { ColorMode, MapMode } from "@features/atlas/core/types";
import type { Coordinates, GeoData } from "../types";

export interface MapViewContextType {
  mapMode: MapMode;
  setMapMode: (v: MapMode) => void;
  isReadonly: boolean;
  isEdit: boolean;
  isEmbed: boolean;
  colorMode: ColorMode;
  setColorMode: React.Dispatch<React.SetStateAction<ColorMode>>;
  isAtlasActive: boolean;
  geoData: GeoData | null;
  geoError: string | null;
  loading: boolean;
  dimensions: { width: number; height: number };
  setDimensions: (dims: { width: number; height: number }) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  center: [number, number];
  setCenter: React.Dispatch<React.SetStateAction<Coordinates>>;
  selectedCoords: Coordinates | null;
  setSelectedCoords: React.Dispatch<React.SetStateAction<Coordinates | null>>;
  handleMoveEnd: (params: {
    zoom: number;
    coordinates: [number, number];
  }) => void;
  centerOnCountry: (isoCode: string) => void;
  mapReady: boolean;
  handleMapReady: (delay?: number) => void;
}

export const MapViewContext = createContext<MapViewContextType | undefined>(
  undefined,
);

export function useMapView() {
  const context = useContext(MapViewContext);
  if (!context) {
    throw new Error("useMapView must be used within a MapViewProvider");
  }
  return context;
}
