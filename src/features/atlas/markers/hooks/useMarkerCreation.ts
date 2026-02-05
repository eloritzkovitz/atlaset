import { useEffect } from "react";
import { useMapView } from "@contexts/MapViewContext";
import { useMarkers } from "@contexts/MarkersContext";
import { useSavedMaps } from "@contexts/SavedMapsContext";

/**
 * Manages marker creation state and handlers.
 * @returns An object containing marker creation state and handlers.
 */
export function useMarkerCreation() {
  const { isEdit } = useMapView();
  const main = useMarkers();
  const saved = useSavedMaps();
  const ctx = isEdit ? saved : main;

  // Handle Escape key to cancel marker creation
  useEffect(() => {
    if (!ctx.isAddingMarker) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        ctx.cancelMarkerCreation();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ctx.isAddingMarker, ctx.cancelMarkerCreation]);

  return {
    isAddingMarker: ctx.isAddingMarker,
    startAddingMarker: ctx.startAddingMarker,
    handleMapClickForMarker: ctx.handleMapClickForMarker,
    cancelMarkerCreation: ctx.cancelMarkerCreation,
  };
}
