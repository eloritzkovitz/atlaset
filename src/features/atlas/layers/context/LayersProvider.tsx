import { useEffect, useState, useCallback, useRef } from "react";
import { logUserActivity } from "@features/activity/utils/activity";
import { useAuth } from "@features/user/auth/hooks/useAuth";
import { useDataLoader } from "@hooks";
import { LayersContext } from "./LayersContext";
import { useLayerManager } from "../hooks/useLayerManager";
import { layersService } from "../services/layersService";
import type { AnyLayer } from "../types";

export function LayersProvider({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();

  const lastAction = useRef<string | null>(null);
  const loadedUserIdRef = useRef<string | null>(null);
  const [layerSelections, setLayerSelections] = useState<
    Record<string, string>
  >({});

  // Data loader for fetching layers
  const fetchLayers = useCallback(() => layersService.load(), []);
  const {
    data: loadedLayers,
    loading,
    error,
    reload: reloadLayers,
  } = useDataLoader<AnyLayer[]>({
    fetchFn: fetchLayers,
  });

  const initialLayers = loadedLayers ?? [];

  // Auth-aware initial fetch guard
  useEffect(() => {
    if (!ready) return;

    if (user?.uid) {
      if (loadedUserIdRef.current !== user.uid) {
        loadedUserIdRef.current = user.uid;
        reloadLayers();
      }
    } else {
      loadedUserIdRef.current = null;
    }
  }, [user?.uid, ready, reloadLayers]);

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

      if (lastAction.current === null) {
        if (user)
          await logUserActivity(210, { count: updatedLayers.length }, user.uid);
      } else {
        lastAction.current = null;
      }
    },
    onLogAction: async (action, layer) => {
      if (!user) return;

      lastAction.current = action;

      const actionCodes = { add: 211, edit: 212, remove: 213, reorder: 214 };
      await logUserActivity(
        actionCodes[action],
        { layerId: layer.id, itemName: layer.name, userName: user.displayName },
        user.uid,
      );
    },
  });

  // Load layers when auth state changes
  useEffect(() => {
    if (!ready) return;
    reloadLayers();
  }, [user?.uid, ready, reloadLayers]);

  // Import layers from JSON
  async function importLayers(newLayers: AnyLayer[]) {
    const before = layers;
    const merged = await _importLayers(newLayers);
    const imported = merged.filter((l) => !before.some((b) => b.id === l.id));
    for (const layer of imported) {
      if (user?.uid) {
        await logUserActivity(
          211,
          {
            layerId: layer.id,
            itemName: layer.name,
            userName: user?.displayName,
          },
          user.uid,
        );
      }
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
