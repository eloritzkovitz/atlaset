import { useLayers } from "@contexts/LayersContext";
import { useTimeline } from "@contexts/TimelineContext";
import { VISITED_LAYER_ID } from "@features/atlas/layers";

/**
 * Determines if "show visited only" mode is active, considering both timeline and layer context.
 * @returns Boolean indicating if only visited countries should be shown.
 */
export function useShowVisitedOnly() {
  const { showVisitedOnly: timelineVisitedOnly } = useTimeline();
  const { layerSelections } = useLayers();
  return timelineVisitedOnly || layerSelections[VISITED_LAYER_ID] === "only";
}
