import { useMemo } from "react";
import { useMapView } from "@features/atlas/map/context/MapViewContext";
import { useSavedMaps } from "@features/atlas/savedMaps/context/SavedMapsContext";
import { useSharedMapInfo } from "@features/atlas/export/hooks/useSharedMapInfo";
import { useMarkers } from "../context/MarkersContext";
import type { Marker } from "../types";

/**
 * Returns the effective markers based on the map view mode.
 * In readonly mode, shared markers are returned if available.
 * @returns Array of effective markers.
 */
export function useEffectiveMarkers(): Marker[] {
  const { markers } = useMarkers();
  const { isReadonly, isEdit } = useMapView();
  const { markers: sharedMarkers } = useSharedMapInfo();
  const { savedMapMarkers } = useSavedMaps();

  return useMemo(() => {
    if (isEdit) {
      return savedMapMarkers;
    }
    if (isReadonly && Array.isArray(sharedMarkers)) {
      return sharedMarkers;
    }
    return markers;
  }, [isReadonly, isEdit, sharedMarkers, markers, savedMapMarkers]);
}
