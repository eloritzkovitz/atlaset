import { useEffect } from "react";
import { useMarkers } from "@contexts/MarkersContext";

/**
 * Manages marker creation state and handlers.
 * @returns An object containing marker creation state and handlers.
 */
export function useMarkerCreation() {
  const {
    isAddingMarker,
    startAddingMarker,
    handleMapClickForMarker,
    cancelMarkerCreation,
  } = useMarkers();

  // Handle Escape key to cancel marker creation
  useEffect(() => {
    if (!isAddingMarker) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelMarkerCreation();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAddingMarker, cancelMarkerCreation]);  

  return {
    isAddingMarker,
    startAddingMarker,
    handleMapClickForMarker,
    cancelMarkerCreation,
  };
}
