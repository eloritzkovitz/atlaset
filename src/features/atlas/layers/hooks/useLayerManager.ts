import { useEffect, useRef, useState } from "react";
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
  const [layers, setLayers] = useState<Layer[]>(initialLayers);
  const [editingLayer, setEditingLayer] = useState<Layer | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const isEditingLayer =
    !!editingLayer && layers.some((o) => o.id === editingLayer.id);

  const isProcessing = useRef(false);

  // Sync layers state with initialLayers prop only on first load
  useEffect(() => {
    if (layers.length === 0 && initialLayers.length > 0) {
      setLayers(initialLayers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLayers]);

  /** Updates the entire layers array and persists changes. */
  async function updateLayers(updated: Layer[]) {
    setLayers(updated);
    await persistLayers(updated);
  }

  /** Updates a specific layer by id. */
  function mapLayer(id: string, updater: (layer: Layer) => Layer) {
    return layers.map((l) => (l.id === id ? updater(l) : l));
  }

  /** Imports new layers. */
  async function importLayers(newLayers: Layer[]) {
    const existingIds = new Set(layers.map((l) => l.id));
    const uniqueNewLayers = newLayers.filter((l) => !existingIds.has(l.id));
    if (uniqueNewLayers.length === 0) return layers;
    const merged = [...layers, ...uniqueNewLayers];
    await updateLayers(merged);
    return merged;
  }

  /** Adds a new layer. */
  async function addLayer(layer: Layer) {
    if (onLogAction) await onLogAction("add", layer);
    await updateLayers([...layers, layer]);
  }

  /** Edits an existing layer. */
  async function editLayer(layer: Layer) {
    if (onLogAction) await onLogAction("edit", layer);
    await updateLayers(layers.map((l) => (l.id === layer.id ? layer : l)));
  }

  /** Renames a layer. */
  async function updateLayerName(id: string, newName: string) {
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;
    if (onLogAction) await onLogAction("edit", layer);
    await updateLayers(mapLayer(id, (l) => ({ ...l, name: newName })));
  }

  /** Reorders layers. */
  async function reorderLayers(newOrder: Layer[]) {
    if (onLogAction && newOrder.length > 0) {
      await onLogAction("reorder", newOrder[0]);
    }

    await updateLayers(newOrder);
  }

  /** Toggles the visibility of a layer. */
  async function toggleLayerVisibility(id: string) {
    await updateLayers(mapLayer(id, (l) => ({ ...l, visible: !l.visible })));
  }

  /** Duplicates a layer. */
  async function duplicateLayer(id: string) {
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;
    const newLayer = {
      ...layer,
      id: crypto.randomUUID(),
      name: layer.name + " (Copy)",
    };
    await addLayer(newLayer);
  }

  /** Removes a layer. */
  async function removeLayer(id: string) {
    const layer = layers.find((l) => l.id === id);
    if (layer && onLogAction) await onLogAction("remove", layer);
    await updateLayers(layers.filter((l) => l.id !== id));
  }

  /** Opens the layer modal in add mode. */
  function openAddLayer() {
    setEditingLayer({
      ...DEFAULT_NEW_LAYER,
      id: crypto.randomUUID(),
    });
    setEditModalOpen(true);
  }

  /** Opens the layer modal in edit mode. */
  function openEditLayer(layer: Layer) {
    setEditingLayer({ ...layer });
    setEditModalOpen(true);
  }

  /** Saves the current layer (add or edit). */
  async function saveLayer() {
    if (isProcessing.current) return;
    isProcessing.current = true;

    const current = editingLayer;
    if (current) {
      const exists = layers.some((o) => o.id === current.id);

      if (onLogAction) await onLogAction(exists ? "edit" : "add", current);

      await updateLayers(
        exists
          ? layers.map((l) => (l.id === current.id ? current : l))
          : [...layers, current],
      );
    }

    closeLayerModal();
    isProcessing.current = false;
  }

  /** Closes the layer modal. */
  function closeLayerModal() {
    setEditModalOpen(false);
    setEditingLayer(null);
  }

  return {
    layers,
    setLayers,
    editingLayer,
    setEditingLayer,
    isEditingLayer,
    isEditModalOpen,
    importLayers,
    addLayer,
    editLayer,
    updateLayerName,
    reorderLayers,
    toggleLayerVisibility,
    duplicateLayer,
    removeLayer,
    openAddLayer,
    openEditLayer,
    closeLayerModal,
    saveLayer,
  };
}
