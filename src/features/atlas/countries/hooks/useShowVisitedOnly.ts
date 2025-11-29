import { useOverlays } from "@contexts/OverlaysContext";
import { useTimeline } from "@contexts/TimelineContext";

/**
 * Determines if "show visited only" mode is active, considering both timeline and overlay context.
 * @returns Boolean indicating if only visited countries should be shown.
 */
export function useShowVisitedOnly() {
  const { showVisitedOnly: timelineVisitedOnly } = useTimeline();
  const { overlaySelections } = useOverlays();
  return (
    timelineVisitedOnly || overlaySelections["visited-countries"] === "only"
  );
}
