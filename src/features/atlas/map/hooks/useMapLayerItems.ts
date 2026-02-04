import { useLayers } from "@contexts/LayersContext";
import { useTimeline } from "@contexts/TimelineContext";
import {
  useLayerItems,
  useSharedLayerItems,
  useTimelineLayerItems,
  isTimelineLayer,
} from "@features/atlas/layers";
import type { MapMode } from "../types";

/**
 * Returns map layer items based on mode.
 * @param mode Current map mode.
 * @returns Array of layer items based on the current mode.
 */
export function useMapLayerItems(mode: MapMode = "normal") {
  const { layers } = useLayers();
  const { timelineMode, selectedYear, layerMode } = useTimeline();
  const timelineLayers = layers.filter(isTimelineLayer);

  // Get static and timeline layer items
  const staticItems = useLayerItems(layers);
  const timelineItems = useTimelineLayerItems(
    timelineLayers,
    selectedYear,
    layerMode,
  );

  // Use shared layer items hook for readonly and edit modes
  const sharedLayerItems = useSharedLayerItems();
  if (mode === "readonly" || mode === "edit") {
    return sharedLayerItems;
  }
  
  return timelineMode ? timelineItems : staticItems;
}
