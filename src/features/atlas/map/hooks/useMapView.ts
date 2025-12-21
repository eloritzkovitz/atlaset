import { useEffect, useState } from "react";
import { DEFAULT_MAP_SETTINGS } from "@constants";
import { useMarkers } from "@contexts/MarkersContext";
import { getCountryCenterAndZoom } from "@features/atlas/map";
import type { GeoData } from "../types";
import type { Marker } from "../../markers/types";

/**
 * Manages map view state including zoom and center.
 * @param geoData - GeoJSON data for the map.
 * @param initialZoom - Initial zoom level.
 * @param initialCenter - Initial center coordinations.
 * @param onMarkerDetails - Callback function to handle marker details.
 * @returns An object containing zoom, center, and handlers to manage map view.
 */
export function useMapView(
  geoData: GeoData,
  initialZoom = DEFAULT_MAP_SETTINGS.minZoom,
  initialCenter: [number, number] = [0, 0],
  onMarkerDetails?: (marker: Marker) => void
) {
  const [zoom, setZoom] = useState(initialZoom);
  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const { markers } = useMarkers();

  // Snap to center at zoom 1
  useEffect(() => {
    if (zoom === 1 && (center[0] !== 0 || center[1] !== 0)) {
      setCenter([0, 0]);
    }
  }, [zoom, center]);

  // Center map on a specific country by its ISO code
  const centerOnCountry = (isoCode: string) => {
    if (!geoData) return;
    const result = getCountryCenterAndZoom(geoData, isoCode);
    if (result) {
      setCenter(result.center);
      setZoom(result.zoom);
    }
  };

  // Center map on a marker
  const centerOnMarker = (marker: Marker, zoomLevel: number = 20) => {
    setCenter([marker.longitude, marker.latitude]);
    setZoom(zoomLevel);
    // If a marker is provided, show its details
    if (onMarkerDetails && "id" in marker) {
      onMarkerDetails(marker);
    }
  };

  // Center map on a marker by its ID
  const centerOnMarkerById = (markerId: string, zoomLevel: number = 20) => {
    const marker = markers.find((m) => m.id === markerId);
    if (marker) {
      centerOnMarker(marker, zoomLevel);
    }
  };

  // Handler for map move end
  const handleMoveEnd = ({
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
  };

  return {
    zoom,
    setZoom,
    center,
    setCenter,
    handleMoveEnd,
    centerOnCountry,
    centerOnMarker,
    centerOnMarkerById,
  };
}
