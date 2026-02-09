import { useLayers } from "@contexts/LayersContext";
import { useSavedMaps } from "@contexts/SavedMapsContext";
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
  const { activeSavedMap } = useSavedMaps();
  const { layers: sharedLayers } = useSharedMapInfo();

  // In edit mode, use activeSavedMap.layers if available
  if (isEdit && activeSavedMap && Array.isArray(activeSavedMap.layers)) {
    return activeSavedMap.layers;
  }
  
  // In readonly mode, use shared layers if available
  if (isReadonly && sharedLayers) {
    return sharedLayers;
  }
  return layers;
}
