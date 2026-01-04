import { useEffect, useState } from "react";
import { useTrips } from "@contexts/TripsContext";
import {
  DEFAULT_NEW_LAYER,
  layersService,
  useSyncVisitedCountriesLayer,
  type AnyLayer,
} from "@features/atlas/layers";
import { logUserActivity, useAuth } from "@features/user";
import { LayersContext } from "./LayersContext";

export function LayersProvider({ children }: { children: React.ReactNode }) {
  // Layer state
  const [layers, setLayers] = useState<AnyLayer[]>([]);
  const [layerSelections, setLayerSelections] = useState<
    Record<string, string>
  >({});

  // Trips context for syncing visited countries layer
  const { trips } = useTrips();

  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [editingLayer, setEditingLayer] = useState<AnyLayer | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const isEditingLayer =
    !!editingLayer && layers.some((o) => o.id === editingLayer.id);

  // Fetch layers on mount
  const { user, ready } = useAuth();

  // Load layers when auth state changes
  useEffect(() => {
    let mounted = true;
    if (!ready) return;
    layersService
      .load()
      .then((dbLayers) => {
        if (mounted) {
          setLayers(dbLayers);
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [user, ready]);

  // Sync visited countries layer with trips
  useSyncVisitedCountriesLayer(trips, layers, setLayers, loading);

  // Import layers from JSON
  async function importLayers(newLayers: AnyLayer[]) {
    const existingIds = new Set(layers.map((o) => o.id));
    const uniqueNewLayers = newLayers.filter((o) => !existingIds.has(o.id));
    const merged = [...layers, ...uniqueNewLayers];

    // Log "add_layer" for each new layer
    for (const layer of uniqueNewLayers) {
      await logUserActivity(
        211,
        {
          layerId: layer.id,
          itemName: layer.name,
        },
        user!.uid
      );
    }

    // Save all layers and log "save_layers" once
    await layersService.save(merged);
    setLayers(merged);
  }

  // Add layer
  async function addLayer(layer: AnyLayer) {
    await layersService.add(layer);
    const dbLayers = await layersService.load();
    if (dbLayers.length > 0) setLayers(dbLayers);
  }

  // Edit layer
  async function editLayer(layer: AnyLayer) {
    await layersService.edit(layer);
    const dbLayers = await layersService.load();
    if (dbLayers.length > 0) setLayers(dbLayers);
  }

  // Remove layer
  async function removeLayer(id: string) {
    await layersService.remove(id);
    const dbLayers = await layersService.load();
    setLayers(dbLayers);
  }

  // Reorder layers (only update layers whose order changed)
  async function reorderLayers(newOrder: AnyLayer[]) {
    const changed: AnyLayer[] = [];
    newOrder.forEach((layer, idx) => {
      if (layer.order !== idx) {
        changed.push({ ...layer, order: idx });
      }
    });
    if (changed.length > 0) {
      await layersService.reorder(changed);
    }
    const dbLayers = await layersService.load();
    setLayers(dbLayers);
  }

  // Toggle visibility
  async function toggleLayerVisibility(id: string) {
    const layer = layers.find((o) => o.id === id);
    if (!layer) return;
    const updatedLayer = { ...layer, visible: !layer.visible };
    await layersService.edit(updatedLayer);
    const dbLayers = await layersService.load();
    setLayers(dbLayers);
  }

  // Modal handlers
  function openAddLayer() {
    setEditingLayer({
      ...DEFAULT_NEW_LAYER,
      id: crypto.randomUUID(),
    });
    setEditModalOpen(true);
  }

  // Open edit modal with selected layer
  function openEditLayer(layer: AnyLayer) {
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

  // Close modal and reset state
  function closeLayerModal() {
    setEditModalOpen(false);
    setEditingLayer(null);
  }

  return (
    <LayersContext.Provider
      value={{
        layers,
        setLayers,
        layerSelections,
        setLayerSelections,
        importLayers,
        addLayer,
        editLayer,
        removeLayer,
        reorderLayers,
        toggleLayerVisibility,
        loading,
        error,
        editingLayer,
        isEditingLayer,
        isEditModalOpen,
        openAddLayer,
        openEditLayer,
        saveLayer,
        closeLayerModal,
        setEditingLayer,
      }}
    >
      {children}
    </LayersContext.Provider>
  );
}
