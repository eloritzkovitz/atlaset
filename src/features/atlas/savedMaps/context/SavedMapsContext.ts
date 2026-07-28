import { createContext, useContext } from "react";
import type { useLayerManager } from "@features/atlas/layers/hooks/useLayerManager";
import type { useMarkerManager } from "@features/atlas/markers/hooks/useMarkerManager";
import type { SavedMap } from "../types";

export interface SavedMapsContextValue {
  savedMaps: SavedMap[];
  loading: boolean;
  error: Error | null;
  reloadSavedMaps: () => Promise<SavedMap[]>;
  openSavedMapModal: (map?: SavedMap | null) => void;
  closeSavedMapModal: () => void;
  exitEditMode: () => void;
  createNewMap: () => void;
  duplicateSavedMap: (original: SavedMap) => Promise<void>;
  saveCurrentMap: () => void;
  viewSavedMap: (map: SavedMap) => void;
  loadSavedMapForEditing: (id: string) => Promise<void>;
  updateSavedMapName: (id: string, newName: string) => Promise<void>;
  saveSavedMap: () => Promise<void>;
  isSavedMapModalOpen: boolean;
  activeSavedMap: SavedMap | null;
  deleteSavedMap: (map: SavedMap) => Promise<void>;
  layers: ReturnType<typeof useLayerManager>;
  markers: ReturnType<typeof useMarkerManager>;
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
