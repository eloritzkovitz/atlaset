import { useEffect, useState, useCallback } from "react";
import {
  layersService,
  useLayerManager,
  type AnyLayer,
} from "@features/atlas/layers";
import { logUserActivity, useAuth } from "@features/user";
import { LayersContext } from "./LayersContext";

export function LayersProvider({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const [layerSelections, setLayerSelections] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLayers, setInitialLayers] = useState<AnyLayer[]>([]);

  // Layer manager for layers state and operations
  const {
    layers,
    setLayers,
    editingLayer,
    setEditingLayer,
    isEditingLayer,
    isEditModalOpen,
    importLayers: _importLayers,
    addLayer,
    editLayer,
    updateLayerName,
    reorderLayers,
    toggleLayerVisibility,
    duplicateLayer,
    removeLayer,
    openAddLayer,
    openEditLayer,
    saveLayer,
    closeLayerModal,
  } = useLayerManager({
    initialLayers,
    persistLayers: async (updatedLayers) => {
      await layersService.save(updatedLayers);
    },
  });

  // Reload layers
  const reloadLayers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dbLayers = await layersService.load();
      setInitialLayers(dbLayers);
      setLayers(dbLayers);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [setLayers]);

  // Load layers when auth state changes
  useEffect(() => {
    if (!ready) return;
    reloadLayers();
  }, [user, ready, reloadLayers]);

  // Import layers from JSON
  async function importLayers(newLayers: AnyLayer[]) {
    const before = layers;
    const merged = await _importLayers(newLayers);
    const imported = merged.filter((l) => !before.some((b) => b.id === l.id));
    for (const layer of imported) {
      await logUserActivity(
        211,
        {
          layerId: layer.id,
          itemName: layer.name,
        },
        user!.uid,
      );
    }
  }

  return (
    <LayersContext.Provider
      value={{
        layers,
        setLayers,
        layerSelections,
        setLayerSelections,
        reloadLayers,
        importLayers,
        addLayer,
        editLayer,
        updateLayerName,
        reorderLayers,
        toggleLayerVisibility,
        duplicateLayer,
        removeLayer,
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
