import { useMapView } from "@features/atlas/map/context/MapViewContext";
import { useSavedMaps } from "@features/atlas/savedMaps/context/SavedMapsContext";
import { useEventListener } from "@hooks";
import { useMarkers } from "../context/MarkersContext";

/**
 * Manages marker creation state and handlers.
 * @returns An object containing marker creation state and handlers.
 */
export function useMarkerCreation() {
  const { isEdit } = useMapView();
  const main = useMarkers();
  const saved = useSavedMaps();
  const ctx = isEdit ? saved.markers : main;
  const { isAddingMarker, cancelMarkerCreation } = ctx;

  // Handle Escape key to cancel marker creation using useEventListener
  useEventListener(
    "keydown",
    (e: KeyboardEvent) => {
      if (isAddingMarker && e.key === "Escape") {
        cancelMarkerCreation();
      }
    },
    window,
  );

  return {
    isAddingMarker: ctx.isAddingMarker,
    startAddingMarker: ctx.startAddingMarker,
    handleMapClickForMarker: ctx.handleMapClickForMarker,
    cancelMarkerCreation: ctx.cancelMarkerCreation,
  };
}
