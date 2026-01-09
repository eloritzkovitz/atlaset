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
  const { isReadonly } = useMapView();
  const { layers: sharedLayers } = useSharedMapInfo();
  return isReadonly && sharedLayers ? sharedLayers : layers;
}
