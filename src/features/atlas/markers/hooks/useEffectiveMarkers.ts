import { useMarkers } from "@contexts/MarkersContext";
import { useMapView } from "@contexts/MapViewContext";
import { useSharedMapInfo } from "@features/atlas/export";
import { useSavedMaps } from "@contexts/SavedMapsContext";
import { useMemo } from "react";
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
  const { editingSavedMap } = useSavedMaps();

  return useMemo(() => {
    if (isEdit && editingSavedMap && Array.isArray(editingSavedMap.markers)) {
      return editingSavedMap.markers;
    }
    if (isReadonly && Array.isArray(sharedMarkers)) {
      return sharedMarkers;
    }
    return markers;
  }, [isReadonly, isEdit, sharedMarkers, markers, editingSavedMap]);
}
