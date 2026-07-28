import { createContext, useContext } from "react";
import type { useMarkerManager } from "../hooks/useMarkerManager";
import type { Marker } from "../types";

export type MarkersContextType = ReturnType<typeof useMarkerManager> & {
  reloadMarkers: () => Promise<Marker[]>;
  selectedMarker: Marker | null;
  detailsModalOpen: boolean;
  detailsModalPosition: { top: number; left: number } | null;
  showMarkerDetails: (
    marker: Marker,
    coords?: { top: number; left: number },
  ) => void;
  closeMarkerDetails: () => void;
};

export const MarkersContext = createContext<MarkersContextType | undefined>(
  undefined,
);

export function useMarkers() {
  const context = useContext(MarkersContext);
  if (!context) {
    throw new Error("useMarkers must be used within a MarkersProvider");
  }
  return context;
}
