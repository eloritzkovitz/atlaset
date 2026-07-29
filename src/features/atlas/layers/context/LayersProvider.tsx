import { useEffect, useState, useCallback, useRef, useMemo } from "react";
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
    setData: setLayers,
    loading,
    error,
    reload: reloadLayers,
  } = useDataLoader<AnyLayer[]>({
    fetchFn: fetchLayers,
  });

  const initialLayers = useMemo(() => loadedLayers ?? [], [loadedLayers]);

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
      setLayers([]);
    }
  }, [user?.uid, ready, reloadLayers, setLayers]);

  // Layer manager for layers state and operations
  const layerManager = useLayerManager({
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

  /** Imports new layers. */
  async function importLayers(newLayers: AnyLayer[]) {
    await layerManager.importLayers(newLayers);
  }

  return (
    <LayersContext.Provider
      value={{
        ...layerManager,
        layerSelections,
        setLayerSelections,
        reloadLayers,
        importLayers,
        loading,
        error,
      }}
    >
      {children}
    </LayersContext.Provider>
  );
}
