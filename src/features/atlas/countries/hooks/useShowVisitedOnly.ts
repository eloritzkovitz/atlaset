import { useOverlays } from "@contexts/OverlayContext";
import { useUI } from "@contexts/UIContext";

export function useShowVisitedOnly() {
  const { showVisitedOnly: timelineVisitedOnly } = useUI();
  const { overlaySelections } = useOverlays();
  return (
    timelineVisitedOnly || overlaySelections["visited-countries"] === "only"
  );
}
