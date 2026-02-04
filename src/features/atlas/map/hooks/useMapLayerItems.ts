import { useLayers } from "@contexts/LayersContext";
import { useMapView } from "@contexts/MapViewContext";
import { useSavedMaps } from "@contexts/SavedMapsContext";
import { useTimeline } from "@contexts/TimelineContext";
import { useSharedMapInfo } from "@features/atlas/export/hooks/useSharedMapInfo";
import {
  isTimelineLayer,
  useLayerItems,
  useTimelineLayerItems,
  getLayerItems,
} from "@features/atlas/layers";
import type { MapMode } from "../types";

/**
 * Returns map layer items based on map mode.
 * @param mode Current map mode.
 * @returns Array of layer items based on the current mode.
 */
export function useMapLayerItems(mode: MapMode = "normal") {
  const { layers } = useLayers();
  const { isEdit } = useMapView();
  const { editingSavedMap } = useSavedMaps();
  const { layers: sharedLayers } = useSharedMapInfo();
  const { timelineMode, selectedYear, layerMode } = useTimeline();

  // Get static and timeline layer items
  const staticItems = useLayerItems(layers);
  const timelineLayers = layers.filter(isTimelineLayer);
  const timelineItems = useTimelineLayerItems(
    timelineLayers,
    selectedYear,
    layerMode,
  );

  // Editing saved map layer items
  const editingItems =
    isEdit && editingSavedMap && Array.isArray(editingSavedMap.layers)
      ? editingSavedMap.layers.flatMap(getLayerItems)
      : [];

  // Shared layer items
  const sharedLayerItems = sharedLayers
    ? sharedLayers.flatMap((layer, idx) =>
        getLayerItems({
          ...layer,
          id: typeof layer.id === "string" ? layer.id : `shared-layer-${idx}`,
          visible: typeof layer.visible === "boolean" ? layer.visible : true,
          countries: Array.isArray(layer.countries)
            ? layer.countries
            : layer.countries != null
              ? [layer.countries]
              : [],
        }),
      )
    : [];

  // Select result conditionally
  if (mode === "edit") {
    if (editingItems.length > 0) return editingItems;
    return sharedLayerItems;
  }

  if (mode === "readonly") {
    return sharedLayerItems;
  }

  return timelineMode ? timelineItems : staticItems;
}
