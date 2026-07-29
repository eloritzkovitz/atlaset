import { useEffectiveMapData } from "@features/atlas/core";
import { useLayers } from "../context/LayersContext";
import type { Layer } from "../types";

/**
 * Returns the effective layers based on the map view mode.
 */
export function useEffectiveLayers(): Layer[] {
  const { layers } = useLayers();

  return useEffectiveMapData({
    local: layers,
    saved: (activeMap) => activeMap?.layers,
    shared: (sharedInfo) => sharedInfo.layers,
  });
}
