import { createContext, useContext } from "react";
import type { AnyLayer } from "@features/atlas/layers/types";

export interface LayersContextType {
  layers: AnyLayer[];
  setLayers: React.Dispatch<React.SetStateAction<AnyLayer[]>>;
  layerSelections: Record<string, string>;
  setLayerSelections: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  reloadLayers: () => Promise<void>;
  importLayers: (newLayers: AnyLayer[]) => Promise<void>;
  addLayer: (layer: AnyLayer) => void;
  editLayer: (layer: AnyLayer) => void;
  updateLayerName: (id: string, newName: string) => void;
  reorderLayers: (newOrder: AnyLayer[]) => void;
  toggleLayerVisibility: (id: string) => void;
  duplicateLayer: (id: string) => void;
  removeLayer: (id: string) => void;
  loading: boolean;
  error: string | null;
  editingLayer: AnyLayer | null;
  isEditingLayer: boolean;
  isEditModalOpen: boolean;
  openAddLayer: () => void;
  openEditLayer: (layer: AnyLayer) => void;
  saveLayer: () => void;
  closeLayerModal: () => void;
  setEditingLayer: React.Dispatch<React.SetStateAction<AnyLayer | null>>;
}

export const LayersContext = createContext<LayersContextType | undefined>(
  undefined
);

export function useLayers() {
  const context = useContext(LayersContext);
  if (!context) {
    throw new Error("useLayers must be used within a LayersProvider");
  }
  return context;
}
