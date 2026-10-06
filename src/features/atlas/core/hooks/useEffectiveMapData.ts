import { useMemo } from "react";
import {
  useSharedMapInfo,
  type SharedMapInfo,
} from "@features/atlas/export/hooks/useSharedMapInfo";
import { useMapView } from "@features/atlas/map/context/MapViewContext";
import type { Marker } from "@features/atlas/markers/types";
import { useSavedMaps } from "@features/atlas/savedMaps/context/SavedMapsContext";
import type { SavedMap } from "@features/atlas/savedMaps/types";

interface EffectiveMapDataOptions<T> {
  local: T;
  saved?: (
    activeSavedMap: SavedMap | null,
    savedMapMarkers: Marker[],
  ) => T | undefined;
  shared?: (sharedMapInfo: SharedMapInfo) => T | undefined;
}

/**
 * Returns the effective map data based on the map view mode.
 */
export function useEffectiveMapData<T>({
  local,
  saved,
  shared,
}: EffectiveMapDataOptions<T>): T {
  const { isEdit, isReadonly } = useMapView();
  const { activeSavedMap, markers } = useSavedMaps();
  const sharedMapInfo = useSharedMapInfo();

  // Determine the effective map data based on the current mode and available data
  return useMemo(() => {
    if (isEdit && saved) {
      const savedValue = saved(activeSavedMap, markers.markers);
      if (savedValue !== undefined) return savedValue;
    }

    if (isReadonly && shared) {
      const sharedValue = shared(sharedMapInfo);
      if (sharedValue !== undefined) return sharedValue;
    }

    return local;
  }, [
    isEdit,
    isReadonly,
    local,
    saved,
    shared,
    activeSavedMap,
    markers.markers,
    sharedMapInfo,
  ]);
}
