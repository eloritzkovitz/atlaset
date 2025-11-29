import { useOverlays } from "@contexts/OverlaysContext";
import { useTimeline } from "@contexts/TimelineContext";
import {
  useOverlayItems,
  useTimelineOverlayItems,
  isTimelineOverlay,
} from "@features/atlas/overlays";

/**
 * Returns map overlay items based on timeline mode.
 * @returns Array of overlay items based on the current timeline mode.
 */
export function useMapOverlayItems() {
  const { overlays } = useOverlays();
  const { timelineMode, selectedYear, overlayMode } = useTimeline();
  const timelineOverlays = overlays.filter(isTimelineOverlay);

  // Get static and timeline overlay items
  const staticItems = useOverlayItems(overlays);
  const timelineItems = useTimelineOverlayItems(
    timelineOverlays,
    selectedYear,
    overlayMode
  );

  // Return items based on timeline mode
  return timelineMode ? timelineItems : staticItems;
}
