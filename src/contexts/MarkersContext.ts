import { createContext, useContext } from "react";
import type { Marker } from "@types";

export interface MarkersContextType {
  markers: Marker[];
  isAddingMarker: boolean;
  startAddingMarker: () => void;
  handleMapClickForMarker: (coords: [number, number]) => void;
  cancelMarkerCreation: () => void;
  addMarker: (marker: Marker) => void;
  editMarker: (updated: Marker) => void;
  removeMarker: (id: string) => void;
  toggleMarkerVisibility: (id: string) => void;
  reorderMarkers: (newOrder: Marker[]) => void;
  editingMarker: Marker | null;
  setEditingMarker: React.Dispatch<React.SetStateAction<Marker | null>>;
  isEditingMarker: boolean;
  isMarkerModalOpen: boolean;
  openAddMarker: (coords?: [number, number]) => void;
  openEditMarker: (marker: Marker) => void;
  saveMarker: () => void;
  closeMarkerModal: () => void;
  selectedMarker: Marker | null;
  detailsModalOpen: boolean;
  detailsModalPosition: { top: number; left: number } | null;
  showMarkerDetails: (
    marker: Marker,
    coords?: { top: number; left: number }
  ) => void;
  closeMarkerDetails: () => void;
}

export const MarkersContext = createContext<MarkersContextType | undefined>(undefined);

export function useMarkers() {
  const context = useContext(MarkersContext);
  if (!context) {
    throw new Error("useMarkers must be used within a MarkersProvider");
  }
  return context;
}
