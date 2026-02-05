import { useEffect, useState } from "react";
import { useTrips } from "@contexts/TripsContext";
import {
  layersService,
  useLayerManager,
  useSyncVisitedCountriesLayer,
  type AnyLayer,
} from "@features/atlas/layers";
import { logUserActivity, useAuth } from "@features/user";
import { LayersContext } from "./LayersContext";

export function LayersProvider({ children }: { children: React.ReactNode }) {
  // Layer selections state
  const [layerSelections, setLayerSelections] = useState<
    Record<string, string>
  >({});

  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trips context for syncing visited countries layer
  const { trips } = useTrips();
  const { user, ready } = useAuth();

  // Main layers state, loaded from service
  const [initialLayers, setInitialLayers] = useState<AnyLayer[]>([]);

  // Load layers when auth state changes
  useEffect(() => {
    let mounted = true;
    if (!ready) return;
    layersService
      .load()
      .then((dbLayers) => {
        if (mounted) {
          setInitialLayers(dbLayers);
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
    removeLayer,
    reorderLayers,
    toggleLayerVisibility,
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

  // Sync visited countries layer with trips
  useSyncVisitedCountriesLayer(trips, layers, setLayers, loading);

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
