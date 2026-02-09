import { createContext, useContext } from "react";
import type { Layer } from "@features/atlas/layers/types";
import type { Marker } from "@features/atlas/markers/types";
import type { Coordinates } from "@features/atlas/map";
import type { SavedMap } from "@features/atlas/saved";

export interface SavedMapsContextValue {
  savedMaps: SavedMap[];
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
  openSavedMapModal: (map?: SavedMap | null) => void;
  closeSavedMapModal: () => void;
  exitEditMode: () => void;  
  createNewMap: () => void;
  saveCurrentMap: () => void;  
  viewSavedMap: (map: SavedMap) => void;
  loadSavedMapForEditing: (id: string) => Promise<void>;
  saveSavedMap: () => Promise<void>;
  isSavedMapModalOpen: boolean;
  activeSavedMap: SavedMap | null;  
  deleteSavedMap: (id: string) => Promise<void>;  
  // Layers
  addLayer: (layer: Layer) => void;
  importLayers: (layers: Layer[]) => void;
  reorderLayers: (layers: Layer[]) => void;
  toggleLayerVisibility: (layerId: string) => void;
  removeLayer: (layerId: string) => void;
  isEditingSavedMapLayer: boolean;
  activeSavedMapLayer: Layer | null;
  setActiveSavedMapLayer: (layer: Layer | null) => void;
  isEditSavedMapLayerModalOpen: boolean;
  openAddLayer: () => void;
  openEditLayer: (layer: Layer) => void;
  closeLayerModal: () => void;
  saveSavedMapLayer: () => void;
  // Markers
  savedMapMarkers: Marker[];
  setSavedMapMarkers: (markers: Marker[]) => void;
  activeSavedMapMarker: Marker | null;
  setActiveSavedMapMarker: (marker: Marker | null) => void;
  isEditingSavedMapMarker: boolean;
  isEditSavedMapMarkerModalOpen: boolean;
  addMarker: (marker: Marker) => Promise<void>;
  editMarker: (marker: Marker) => Promise<void>;
  removeMarker: (id: string) => Promise<void>;
  reorderMarkers: (markers: Marker[]) => Promise<void>;
  toggleMarkerVisibility: (id: string) => Promise<void>;
  openAddMarker: (coords?: Coordinates) => void;
  openEditMarker: (marker: Marker) => void;
  saveSavedMapMarker: () => Promise<void>;
  closeMarkerModal: () => void;
  // Marker creation state/handlers for saved maps
  isAddingMarker: boolean;
  startAddingMarker: () => void;
  handleMapClickForMarker: (coords: Coordinates) => void;
  cancelMarkerCreation: () => void;  
}

export const SavedMapsContext = createContext<
  SavedMapsContextValue | undefined
>(undefined);

// Custom hook to use the SavedMapsContext
export const useSavedMaps = () => {
  const ctx = useContext(SavedMapsContext);
  if (!ctx)
    throw new Error("useSavedMaps must be used within a SavedMapsProvider");
  return ctx;
};
