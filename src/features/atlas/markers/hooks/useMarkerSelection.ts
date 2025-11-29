import { useMarkers } from "@contexts/MarkersContext";

/**
 * Manages marker selection state and handlers.
 * @returns An object containing marker selection state and handlers.
 */
export function useMarkerSelection() {
  const {
    selectedMarker,
    detailsModalOpen,
    detailsModalPosition,
    showMarkerDetails,
    closeMarkerDetails,
  } = useMarkers();

  return {
    selectedMarker,
    detailsModalOpen,
    detailsModalPosition,
    showMarkerDetails,
    closeMarkerDetails,
  };
}
