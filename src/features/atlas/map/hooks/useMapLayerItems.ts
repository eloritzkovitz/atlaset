import { useLayers } from "@contexts/LayersContext";
import { useTimeline } from "@contexts/TimelineContext";
import {
  useLayerItems,
  useTimelineLayerItems,
  isTimelineLayer,
} from "@features/atlas/layers";
import { useSharedLayerItems } from "@features/atlas/layers/hooks/useSharedLayerItems";

/**
 * Returns map layer items based on mode.
 * @returns Array of layer items based on the current mode.
 */
export function useMapLayerItems(mode = "normal") {
  const { layers } = useLayers();
  const { timelineMode, selectedYear, layerMode } = useTimeline();
  const timelineLayers = layers.filter(isTimelineLayer);

  // Get static and timeline layer items
  const staticItems = useLayerItems(layers);
  const timelineItems = useTimelineLayerItems(
    timelineLayers,
    selectedYear,
    layerMode
  );

  // Use shared layer items hook for readonly mode
  const readonlyLayerItems = useSharedLayerItems();
  if (mode === "readonly") {
    return readonlyLayerItems;
  }
  return timelineMode ? timelineItems : staticItems;
}
