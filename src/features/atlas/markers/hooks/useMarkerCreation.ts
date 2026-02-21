import { useEffect } from "react";
import { useMapView } from "@contexts/MapViewContext";
import { useMarkers } from "@contexts/MarkersContext";
import { useSavedMaps } from "@contexts/SavedMapsContext";
import { useEventListener } from "@hooks/dom/useEventListener";

/**
 * Manages marker creation state and handlers.
 * @returns An object containing marker creation state and handlers.
 */
export function useMarkerCreation() {
  const { isEdit } = useMapView();
  const main = useMarkers();
  const saved = useSavedMaps();
  const ctx = isEdit ? saved : main;
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
