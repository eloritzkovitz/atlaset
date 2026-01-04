import { useLayers } from "@contexts/LayersContext";
import { useTimeline } from "@contexts/TimelineContext";
import {
  useLayerItems,
  useTimelineLayerItems,
  isTimelineLayer,
} from "@features/atlas/layers";

/**
 * Returns map layer items based on timeline mode.
 * @returns Array of layer items based on the current timeline mode.
 */
export function useMapLayerItems() {
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

  // Return items based on timeline mode
  return timelineMode ? timelineItems : staticItems;
}
