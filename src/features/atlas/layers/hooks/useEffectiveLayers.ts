import { useLayers } from "@contexts/LayersContext";
import { useMapView } from "@contexts/MapViewContext";
import { useSharedMapInfo } from "@features/atlas/export/hooks/useSharedMapInfo";

/**
 * Returns the effective layers based on the map view mode.
 * In readonly mode, shared layers are returned if available.
 * @returns Array of effective layers.
 */
export function useEffectiveLayers() {
  const { layers } = useLayers();
  const { isEdit, isReadonly } = useMapView();
  const { layers: sharedLayers } = useSharedMapInfo();

  // In edit or readonly mode, use shared layers if available
  if ((isEdit || isReadonly) && sharedLayers) {
    return sharedLayers;
  }
  return layers;
}
