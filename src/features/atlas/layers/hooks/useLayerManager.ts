import { useEffect, useState } from "react";
import { DEFAULT_NEW_LAYER, type Layer } from "@features/atlas/layers";

export interface UseLayerManagerOptions {
  initialLayers: Layer[];
  persistLayers: (layers: Layer[]) => Promise<void>;
}

/**
 * Manages layer state and operations.
 * @param initialLayers - Initial layers to manage.
 * @param persistLayers - Function to persist layer changes.
 * @returns Layer management utilities and state.
 */
export function useLayerManager({
  initialLayers,
  persistLayers,
}: UseLayerManagerOptions) {
  const [layers, setLayers] = useState<Layer[]>(initialLayers);
  const [editingLayer, setEditingLayer] = useState<Layer | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const isEditingLayer =
    !!editingLayer && layers.some((o) => o.id === editingLayer.id);

  // Sync layers state with initialLayers prop only on first load
  useEffect(() => {
    if (layers.length === 0 && initialLayers.length > 0) {
      setLayers(initialLayers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLayers]);

  // Import layers
  async function importLayers(newLayers: Layer[]) {
    const existingIds = new Set(layers.map((l) => l.id));
    const uniqueNewLayers = newLayers.filter((l) => !existingIds.has(l.id));

    // If no new unique layers, do nothing
    if (uniqueNewLayers.length === 0) return layers;
    const merged = [...layers, ...uniqueNewLayers];
    setLayers(merged);

    await persistLayers(merged);

    return merged;
  }

  // Add layer
  async function addLayer(layer: Layer) {
    const updated = [...layers, layer];
    setLayers(updated);
    await persistLayers(updated);
  }

  // Edit layer
  async function editLayer(layer: Layer) {
    const updated = layers.map((l) => (l.id === layer.id ? layer : l));
    setLayers(updated);
    await persistLayers(updated);
  }

  // Remove layer
  async function removeLayer(id: string) {
    const updated = layers.filter((l) => l.id !== id);
    setLayers(updated);
    await persistLayers(updated);
  }

  // Reorder layers
  async function reorderLayers(newOrder: Layer[]) {
    setLayers(newOrder);
    await persistLayers(newOrder);
  }

  // Toggle visibility
  async function toggleLayerVisibility(id: string) {
    const updated = layers.map((l) =>
      l.id === id ? { ...l, visible: !l.visible } : l,
    );
    setLayers(updated);
    await persistLayers(updated);
  }

  // Open add layer modal
  function openAddLayer() {
    setEditingLayer({
      ...DEFAULT_NEW_LAYER,
      id: crypto.randomUUID(),
    });
    setEditModalOpen(true);
  }

  // Open edit layer modal
  function openEditLayer(layer: Layer) {
    setEditingLayer({ ...layer });
    setEditModalOpen(true);
  }

  // Save layer (add or edit)
  async function saveLayer() {
    if (!editingLayer) return;
    const exists = layers.some((o) => o.id === editingLayer.id);
    if (exists) {
      await editLayer(editingLayer);
    } else {
      await addLayer(editingLayer);
    }
    closeLayerModal();
  }

  // Close layer modal
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
    removeLayer,
    reorderLayers,
    toggleLayerVisibility,
    openAddLayer,
    openEditLayer,
    closeLayerModal,
    saveLayer,
  };
}
