import { useState } from "react";
import { useEntityCollection } from "@hooks";
import { DEFAULT_NEW_LAYER } from "../constants/layers";
import type { Layer } from "../types";

export interface UseLayerManagerOptions {
  initialLayers: Layer[];
  persistLayers: (layers: Layer[]) => Promise<void>;
  onLogAction?: (
    action: "add" | "edit" | "remove" | "reorder",
    layer: Layer,
  ) => Promise<void>;
}

/**
 * Manages layer state and operations.
 * @param initialLayers - Initial layers to manage.
 * @param persistLayers - Function to persist layer changes.
 * @param onLogAction - Optional function to log layer actions.
 * @returns Layer management utilities and state.
 */
export function useLayerManager({
  initialLayers,
  persistLayers,
  onLogAction,
}: UseLayerManagerOptions) {
  const collection = useEntityCollection<Layer>({
    initialItems: initialLayers,
    persistItems: persistLayers,
    onLogAction,
  });

  const [editingLayer, setEditingLayer] = useState<Layer | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const isEditingLayer =
    !!editingLayer && collection.items.some((o) => o.id === editingLayer.id);

  /** Imports new layers. */
  async function importLayers(newLayers: Layer[]) {
    const existingIds = new Set(collection.items.map((l) => l.id));
    const uniqueNewLayers = newLayers.filter((l) => !existingIds.has(l.id));
    if (uniqueNewLayers.length === 0) return collection.items;

    const merged = [...collection.items, ...uniqueNewLayers];
    collection.setItems(merged);
    await persistLayers(merged);
    return merged;
  }

  /** Duplicates a layer. */
  async function duplicateLayer(id: string) {
    const layer = collection.items.find((l) => l.id === id);
    if (!layer) return;

    const newLayer: Layer = {
      ...layer,
      id: crypto.randomUUID(),
      name: `${layer.name} (Copy)`,
    };
    await collection.addItem(newLayer);
  }

  /** Opens modal for creating a new layer. */
  function openAddLayer() {
    setEditingLayer({
      ...DEFAULT_NEW_LAYER,
      id: crypto.randomUUID(),
    });
    setEditModalOpen(true);
  }

  /** Opens modal for editing an existing layer. */
  function openEditLayer(layer: Layer) {
    setEditingLayer({ ...layer });
    setEditModalOpen(true);
  }

  /** Closes the layer modal. */
  function closeLayerModal() {
    setEditModalOpen(false);
    setEditingLayer(null);
  }

  /** Saves the current layer from the modal. */
  async function saveLayer() {
    if (!editingLayer) return;

    const exists = collection.items.some((o) => o.id === editingLayer.id);
    if (exists) {
      await collection.updateItem(editingLayer);
    } else {
      await collection.addItem(editingLayer);
    }

    closeLayerModal();
  }

  return {
    layers: collection.items,
    setLayers: collection.setItems,
    addLayer: collection.addItem,
    editLayer: collection.updateItem,
    removeLayer: collection.removeItem,
    reorderLayers: collection.reorderItems,
    updateLayerName: collection.updateItemName,
    toggleLayerVisibility: collection.toggleItemVisibility,
    duplicateLayer,
    importLayers,
    editingLayer,
    setEditingLayer,
    isEditingLayer,
    isEditModalOpen,
    openAddLayer,
    openEditLayer,
    closeLayerModal,
    saveLayer,
  };
}
