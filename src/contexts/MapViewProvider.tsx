import { type ReactNode, useState, useEffect, useCallback } from "react";
import { DEFAULT_MAP_SETTINGS, MAP_OPTIONS } from "@constants";
import { useGeoData, type Coordinates } from "@features/atlas/map";
import { getCountryCenterAndZoom } from "@features/atlas/map";
import { MapViewContext } from "./MapViewContext";
import { useSettings } from "./SettingsContext";

export interface MapViewProviderProps {
  children: ReactNode;
}

export function MapViewProvider({ children }: MapViewProviderProps) {
  const { geoData } = useGeoData();
  const { settings, updateSettings } = useSettings();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Map ready state
  const [mapReady, setMapReady] = useState(false);
  const handleMapReady = useCallback((delay = 50) => {
    setTimeout(() => setMapReady(true), delay);
  }, []);

  // Map UI config
  const map = settings.map ?? {
    projection: undefined,
    borderColor: undefined,
    borderWidth: undefined,
  };

  // Use defaults if not set
  const projection = map.projection ?? MAP_OPTIONS.projection[0].value;
  const borderColor = map.borderColor ?? MAP_OPTIONS.strokeColor[0].value;
  const borderWidth = map.borderWidth ?? MAP_OPTIONS.strokeWidth[0].value;
 
  // Update functions
  const setProjection = (v: string) =>
    updateSettings({ map: { ...map, projection: v } });
  const setBorderColor = (v: string) =>
    updateSettings({ map: { ...map, borderColor: v } });
  const setBorderWidth = (v: number) =>
    updateSettings({ map: { ...map, borderWidth: v } });

  // Map view state
  const [zoom, setZoom] = useState(DEFAULT_MAP_SETTINGS.minZoom);
  const [center, setCenter] = useState<Coordinates>([0, 0]);
  const [selectedCoords, setSelectedCoords] = useState<Coordinates | null>(
    null
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
    [geoData]
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
    []
  );

  return (
    <MapViewContext.Provider
      value={{
        geoData,
        projection,
        setProjection,
        dimensions,
        setDimensions,
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
