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

  // Update layers and persist changes
  async function updateLayers(updated: Layer[]) {
    setLayers(updated);
    await persistLayers(updated);
  }

  // Update a specific layer by id
  function mapLayer(id: string, updater: (layer: Layer) => Layer) {
    return layers.map((l) => (l.id === id ? updater(l) : l));
  }

  // Import layers
  async function importLayers(newLayers: Layer[]) {
    const existingIds = new Set(layers.map((l) => l.id));
    const uniqueNewLayers = newLayers.filter((l) => !existingIds.has(l.id));
    if (uniqueNewLayers.length === 0) return layers;
    const merged = [...layers, ...uniqueNewLayers];
    await updateLayers(merged);
    return merged;
  }

  // Add layer
  async function addLayer(layer: Layer) {
    await updateLayers([...layers, layer]);
  }

  // Edit layer
  async function editLayer(layer: Layer) {
    await updateLayers(mapLayer(layer.id, () => layer));
  }

  // Rename layer
  async function updateLayerName(id: string, newName: string) {
    await updateLayers(mapLayer(id, (l) => ({ ...l, name: newName })));
  }

  // Reorder layers
  async function reorderLayers(newOrder: Layer[]) {
    await updateLayers(newOrder);
  }

  // Toggle visibility
  async function toggleLayerVisibility(id: string) {
    await updateLayers(mapLayer(id, (l) => ({ ...l, visible: !l.visible })));
  }

  // Duplicate layer
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

  // Remove layer
  async function removeLayer(id: string) {
    await updateLayers(layers.filter((l) => l.id !== id));
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
