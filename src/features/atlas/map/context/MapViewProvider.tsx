import {
  type ReactNode,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useMapMode } from "@features/atlas/core/hooks/useMapMode";
import type { ColorMode } from "@features/atlas/core/types";
import { DEFAULT_MAP_SETTINGS } from "@features/settings";
import { MapViewContext } from "./MapViewContext";
import type { Coordinates } from "../types";

export interface MapViewProviderProps {
  children: ReactNode;
}

export function MapViewProvider({ children }: MapViewProviderProps) {
  const { mapMode, setMapMode, isReadonly, isEdit, isEmbed } = useMapMode();

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Color mode state
  const [colorMode, setColorMode] = useState<ColorMode>("standard");
  const isAtlasActive = colorMode === "atlas";

  // Map ready state
  const [mapReady, setMapReady] = useState(false);
  const handleMapReady = useCallback((delay = 50) => {
    setTimeout(() => setMapReady(true), delay);
  }, []);

  // Map view state
  const [zoom, setZoom] = useState(DEFAULT_MAP_SETTINGS.minZoom);
  const [center, setCenter] = useState<Coordinates>([0, 0]);
  const [selectedCoords, setSelectedCoords] = useState<Coordinates | null>(
    null,
  );

  // Snap to center at zoom 1
  useEffect(() => {
    if (zoom === 1 && (center[0] !== 0 || center[1] !== 0)) {
      setCenter([0, 0]);
    }
  }, [zoom, center]);

  // Handler for map move end
  const handleMoveEnd = useCallback(
    ({
      zoom: newZoom,
      coordinates,
    }: {
      zoom: number;
      coordinates: [number, number];
    }) => {
      setZoom(newZoom);
      if (newZoom === 1) {
        setCenter([0, 0]);
      } else {
        setCenter(coordinates);
      }
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      mapMode,
      setMapMode,
      isReadonly,
      isEdit,
      isEmbed,
      colorMode,
      setColorMode,
      isAtlasActive,
      dimensions,
      setDimensions,
      zoom,
      setZoom,
      center,
      selectedCoords,
      setSelectedCoords,
      setCenter,
      handleMoveEnd,
      mapReady,
      handleMapReady,
    }),
    [
      mapMode,
      setMapMode,
      isReadonly,
      isEdit,
      isEmbed,
      colorMode,
      setColorMode,
      isAtlasActive,
      dimensions,
      setDimensions,
      zoom,
      setZoom,
      center,
      selectedCoords,
      setSelectedCoords,
      setCenter,
      handleMoveEnd,
      mapReady,
      handleMapReady,
    ],
  );

  return (
    <MapViewContext.Provider value={contextValue}>
      {children}
    </MapViewContext.Provider>
  );
}
