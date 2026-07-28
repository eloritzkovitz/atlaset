import { useEffectiveMapData } from "@features/atlas/core";
import { useMarkers } from "../context/MarkersContext";
import type { Marker } from "../types";

/**
 * Returns the effective markers based on the map view mode.
 */
export function useEffectiveMarkers(): Marker[] {
  const { markers } = useMarkers();

  return useEffectiveMapData({
    local: markers,
    saved: (_, savedMarkers) => savedMarkers,
    shared: (sharedInfo) => sharedInfo.markers,
  });
}
