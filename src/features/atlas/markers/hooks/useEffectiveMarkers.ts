import { useMarkers } from "@contexts/MarkersContext";
import { useMapView } from "@contexts/MapViewContext";
import { useSharedMapInfo } from "@features/atlas/export";
import { useMemo } from "react";
import type { Marker } from "../types";

/**
 * Returns the effective markers based on the map view mode.
 * In readonly mode, shared markers are returned if available.
 * @returns Array of effective markers.
 */
export function useEffectiveMarkers(): Marker[] {
  const { markers } = useMarkers();
  const { isReadonly } = useMapView();
  const { markers: sharedMarkers } = useSharedMapInfo();

  return useMemo(() => {
    if (isReadonly && Array.isArray(sharedMarkers)) {
      return sharedMarkers;
    }
    return markers;
  }, [isReadonly, sharedMarkers, markers]);
}
