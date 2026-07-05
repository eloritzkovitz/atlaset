import { type ReactNode, useState, useEffect, useCallback } from "react";
import {
  getCountryCenterAndZoom,
  useGeoData,
  type Coordinates,
} from "@features/atlas/map";
import type { ColorMode, MapMode } from "@features/atlas/shared";
import { DEFAULT_MAP_SETTINGS, MAP_CONFIG_OPTIONS } from "@features/settings";
import { MapViewContext } from "./MapViewContext";
import { useSettings } from "./SettingsContext";

export interface MapViewProviderProps {
  children: ReactNode;
}

export function MapViewProvider({ children }: MapViewProviderProps) {
  const { geoData } = useGeoData();
  const { settings, updateSettings } = useSettings();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Map mode state
  const [mapMode, setMapMode] = useState<MapMode>("view");
  const isReadonly = mapMode === "readonly";
  const isEdit = mapMode === "edit";

  // Color mode state
  const [colorMode, setColorMode] = useState<ColorMode>("standard");
  const isAtlasActive = colorMode === "atlas";

  // Map ready state
  const [mapReady, setMapReady] = useState(false);
  const handleMapReady = useCallback((delay = 50) => {
    setTimeout(() => setMapReady(true), delay);
  }, []);

  // Map UI config
  const map = settings.map ?? {
    projection: undefined,
    baseColor: undefined,
    borderColor: undefined,
    borderWidth: undefined,
  };

  // Use defaults if not set
  const projection = map.projection ?? MAP_CONFIG_OPTIONS.projection[0].value;
  const baseColor = map.baseColor ?? MAP_CONFIG_OPTIONS.baseColor[0].value;
  const borderColor =
    map.borderColor ?? MAP_CONFIG_OPTIONS.strokeColor[0].value;
  const borderWidth =
    map.borderWidth ?? MAP_CONFIG_OPTIONS.strokeWidth[0].value;

  // Update functions
  const setProjection = (v: string) =>
    updateSettings({ map: { ...map, projection: v } });
  const setBaseColor = (v: string) =>
    updateSettings({ map: { ...map, baseColor: v } });
  const setBorderColor = (v: string) =>
    updateSettings({ map: { ...map, borderColor: v } });
  const setBorderWidth = (v: number) =>
    updateSettings({ map: { ...map, borderWidth: v } });

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
        colorMode,
        setColorMode,
        isAtlasActive,
        geoData,
        projection,
        setProjection,
        dimensions,
        setDimensions,
        baseColor,
        setBaseColor,
        borderColor,
        setBorderColor,
        borderWidth,
        setBorderWidth,
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
