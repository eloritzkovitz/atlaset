import { useOverlays } from "@contexts/OverlayContext";
import { useTimeline } from "@contexts/TimelineContext";

export function useShowVisitedOnly() {
  const { showVisitedOnly: timelineVisitedOnly } = useTimeline();
  const { overlaySelections } = useOverlays();
  return (
    timelineVisitedOnly || overlaySelections["visited-countries"] === "only"
  );
}
