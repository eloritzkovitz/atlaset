import { createContext, useContext } from "react";
import type { SavedMap } from "@features/atlas/saved";
import type { Layer } from "@features/atlas/layers/types";

export interface SavedMapsContextValue {
  savedMaps: SavedMap[];
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
  addMap: (map: SavedMap) => Promise<void>;
  deleteMap: (id: string) => Promise<void>;
  saveCurrentMap: () => void;
  viewSavedMap: (map: SavedMap) => void;
  loadSavedMapForEditing: (id: string) => Promise<void>;
  isSavedMapModalOpen: boolean;
  editingSavedMap: SavedMap | null;
  openSavedMapModal: (map?: SavedMap | null) => void;
  closeSavedMapModal: () => void;
  saveSavedMap: () => Promise<void>;
  importLayers: (layers: Layer[]) => void;
  reorderLayers: (layers: Layer[]) => void;
  toggleLayerVisibility: (layerId: string) => void;
  removeLayer: (layerId: string) => void;
  isEditingSavedMapLayer: boolean;
  editingSavedMapLayer: Layer | null;
  setEditingSavedMapLayer: (layer: Layer | null) => void;
  isEditSavedMapLayerModalOpen: boolean;
  openEditSavedMapLayerModal: (layer: Layer) => void;
  closeSavedMapLayerModal: () => void;
  saveSavedMapLayer: () => void;
  exitEditMode: () => void;
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
