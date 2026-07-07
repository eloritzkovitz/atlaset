import { type ReactNode, useState, useEffect, useCallback } from "react";
import {
  getCountryCenterAndZoom,
  useGeoData,
  type Coordinates,
} from "@features/atlas/map";
import { useMapMode, type ColorMode } from "@features/atlas/shared";
import { DEFAULT_MAP_SETTINGS } from "@features/settings";
import { MapViewContext } from "./MapViewContext";

export interface MapViewProviderProps {
  children: ReactNode;
}

export function MapViewProvider({ children }: MapViewProviderProps) {
  const { geoData } = useGeoData();
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

  // Center map on a specific country by its ISO code
  const centerOnCountry = useCallback(
    (isoCode: string) => {
      if (!geoData) return;
      const result = getCountryCenterAndZoom(geoData, isoCode);
      if (result) {
        setCenter(result.center);
        setZoom(result.zoom);
      }
    },
    [geoData],
  );

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

  return (
    <MapViewContext.Provider
      value={{
        mapMode,
        setMapMode,
        isReadonly,
        isEdit,
        isEmbed,
        colorMode,
        setColorMode,
        isAtlasActive,
        geoData,
        dimensions,
        setDimensions,
        zoom,
        setZoom,
        center,
        selectedCoords,
        setSelectedCoords,
        setCenter,
        handleMoveEnd,
        centerOnCountry,
        mapReady,
        handleMapReady,
      }}
    >
      {children}
    </MapViewContext.Provider>
  );
}
