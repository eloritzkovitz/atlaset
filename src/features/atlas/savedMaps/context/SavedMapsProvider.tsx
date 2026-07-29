import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { logUserActivity } from "@features/activity";
import { useMapMode } from "@features/atlas/core";
import { decodeMapData } from "@features/atlas/export/utils/mapShare";
import {
  normalizeLayers,
  useLayerManager,
  type Layer,
} from "@features/atlas/layers";
import { normalizeMarkers } from "@features/atlas/markers/utils/markers";
import { useMarkerManager } from "@features/atlas/markers/hooks/useMarkerManager";
import { useAuth } from "@features/user/auth/hooks/useAuth";
import { useDataLoader } from "@hooks";
import { getQueryParam } from "@utils/url";
import {
  SavedMapsContext,
  type SavedMapsContextValue,
} from "./SavedMapsContext";
import { savedMapsService } from "../services/savedMapsService";
import { type SavedMap } from "../types";

export const SavedMapsProvider = ({ children }: { children: ReactNode }) => {
  const { user, ready } = useAuth();
  const { mapMode, mapId } = useMapMode();
  const navigate = useNavigate();

  const [activeSavedMap, setActiveSavedMap] = useState<SavedMap | null>(null);
  const [isSavedMapModalOpen, setSavedMapModalOpen] = useState(false);
  const lastAction = useRef<string | null>(null);
  const loadedUserIdRef = useRef<string | null>(null);

  // Data loader for saved maps
  const fetchSavedMaps = useCallback(() => savedMapsService.load(), []);
  const {
    data: loadedMaps,
    setData: setSavedMaps,
    loading,
    error,
    reload: reloadSavedMaps,
  } = useDataLoader<SavedMap[]>({
    fetchFn: fetchSavedMaps,
  });

  const savedMaps = useMemo(() => loadedMaps ?? [], [loadedMaps]);

  // Auth-aware initial fetch guard
  useEffect(() => {
    if (!ready) return;

    if (user?.uid) {
      if (loadedUserIdRef.current !== user.uid) {
        loadedUserIdRef.current = user.uid;
        reloadSavedMaps();
      }
    } else {
      loadedUserIdRef.current = null;
      setSavedMaps([]);
    }
  }, [user?.uid, ready, reloadSavedMaps, setSavedMaps]);

  // Layer manager for saved map layers
  const layerManager = useLayerManager({
    initialLayers: activeSavedMap?.layers ?? [],
    persistLayers: async (layers) => {
      if (!activeSavedMap) return;
      const updated = { ...activeSavedMap, layers };
      setActiveSavedMap(updated);
      await savedMapsService.set(updated);

      lastAction.current = null;
    },
    onLogAction: async (action, layer) => {
      if (!user?.uid || !activeSavedMap) return;

      lastAction.current = action;

      const logMap = { add: 234, edit: 235, remove: 236, reorder: 237 };
      await logUserActivity(
        logMap[action],
        {
          layerId: layer.id,
          itemName: layer.name,
          mapName: activeSavedMap.name,
          userName: user.displayName,
        },
        user.uid,
      );
    },
  });

  // Marker manager for saved map markers
  const markerManager = useMarkerManager({
    initialMarkers: activeSavedMap?.markers ?? [],
    persistMarkers: async (markers) => {
      if (!activeSavedMap) return;
      const updated = { ...activeSavedMap, markers };
      setActiveSavedMap(updated);
      markerManager.setMarkers(markers);
      await savedMapsService.set(updated);
    },
    onLogAction: async (action, marker) => {
      if (!user?.uid || !activeSavedMap) return;

      const logMap = { add: 234, edit: 235, remove: 236, reorder: 237 };
      await logUserActivity(
        logMap[action],
        {
          markerId: marker.id,
          itemName: marker.name,
          mapName: activeSavedMap.name,
          userName: user.displayName,
        },
        user.uid,
      );
    },
  });

  // Handle importing layers into the active saved map
  const handleImportLayers = async (layers: Layer[]) => {
    if (!activeSavedMap) return [];
    const before = layerManager.layers;
    const merged = await layerManager.importLayers(layers);
    const imported = merged.filter((l) => !before.some((b) => b.id === l.id));
    for (const layer of imported) {
      if (user?.uid) {
        await logUserActivity(
          234,
          {
            layerId: layer.id,
            itemName: layer.name,
            mapName: activeSavedMap.name,
          },
          user.uid,
        );
      }
    }
    const updated = { ...activeSavedMap, layers: merged };
    setActiveSavedMap(updated);
    await savedMapsService.set(updated);
    await reloadSavedMaps();
    return merged;
  };

  // Log user activity for saved map actions
  const logMapAction = async (action: "add" | "delete", map: SavedMap) => {
    if (!user?.uid) return;
    const logMap = { add: 231, delete: 233 };
    await logUserActivity(
      logMap[action],
      {
        mapId: map.id,
        mapName: map.name,
        userName: user.displayName,
      },
      user.uid,
    );
  };

  // Sync activeSavedMap layers/markers with layer/marker managers
  useEffect(() => {
    if (activeSavedMap) {
      layerManager.setLayers(activeSavedMap.layers ?? []);
      markerManager.setMarkers(activeSavedMap.markers ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSavedMap]);

  // Watch mapMode and mapId from hook and load/clear activeSavedMap accordingly
  useEffect(() => {
    if (mapMode === "edit" && mapId) {
      if (!activeSavedMap || activeSavedMap.id !== mapId) {
        loadSavedMapForEditing(mapId);
      }
    } else {
      if (activeSavedMap) setActiveSavedMap(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapMode, mapId]);

  // Open saved map modal
  function openSavedMapModal(map: SavedMap | null = null) {
    setActiveSavedMap(map);
    setSavedMapModalOpen(true);
  }

  // Close saved map modal
  function closeSavedMapModal() {
    setSavedMapModalOpen(false);
    setTimeout(() => {
      if (!layerManager.isEditModalOpen) {
        setActiveSavedMap(null);
      }
    }, 0);
  }

  // Exit edit mode: remove edit/map from URL and clear activeSavedMap
  function exitEditMode() {
    const params = new URLSearchParams(window.location.search);
    params.delete("edit");
    params.delete("map");
    navigate(
      `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`,
    );
    setActiveSavedMap(null);
    layerManager.setLayers([]);
  }

  // Create a new map
  function createNewMap() {
    openSavedMapModal({
      id: crypto.randomUUID(),
      name: "",
      layers: [],
      markers: [],
      createdAt: new Date().toISOString(),
    });
  }

  // Duplicate a saved map
  async function duplicateSavedMap(original: SavedMap) {
    const newMap: SavedMap = {
      ...original,
      id: crypto.randomUUID(),
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      layers: original.layers.map((l) => ({ ...l })),
      markers: original.markers?.map((m) => ({ ...m })) ?? [],
    };
    await savedMapsService.set(newMap);
    await reloadSavedMaps();
  }

  // Save current map from URL
  function saveCurrentMap() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("map");
    if (!code) return;
    const exportData = decodeMapData(code);
    openSavedMapModal({
      id: crypto.randomUUID(),
      name: "",
      layers: normalizeLayers(exportData.layers) ?? [],
      markers: normalizeMarkers(exportData.markers) ?? [],
      createdAt: new Date().toISOString(),
    });
  }

  // View a saved map by updating the URL and loading it for editing
  function viewSavedMap(map: SavedMap) {
    const params = new URLSearchParams(window.location.search);
    params.set("map", map.id);
    params.set("edit", "true");
    navigate(`${window.location.pathname}?${params.toString()}`);
    loadSavedMapForEditing(map.id);
  }

  // Load a saved map for editing without triggering global fullscreen loaders if already loaded
  const loadSavedMapForEditing = useCallback(
    async (id: string) => {
      const cachedMap = savedMaps.find((m) => m.id === id);
      if (cachedMap) {
        setActiveSavedMap(cachedMap);
        return;
      }
      try {
        const map = await savedMapsService.get(id);
        if (map) {
          setActiveSavedMap(map);
        }
      } catch (err) {
        console.error("Failed to load map for editing:", err);
      }
    },
    [savedMaps],
  );

  // Update map name and persist
  async function updateSavedMapName(id: string, newName: string) {
    setSavedMaps((prev) =>
      prev ? prev.map((m) => (m.id === id ? { ...m, name: newName } : m)) : [],
    );
    const mapToUpdate =
      activeSavedMap && activeSavedMap.id === id
        ? { ...activeSavedMap, name: newName }
        : savedMaps.find((m) => m.id === id);

    if (mapToUpdate && mapToUpdate.id) {
      await savedMapsService.set(mapToUpdate);
      await reloadSavedMaps();
    }
  }

  // Save edited or new saved map
  async function saveSavedMap() {
    if (!activeSavedMap) return;

    const isNew = !savedMaps.some((m) => m.id === activeSavedMap.id);

    const mapToSave = {
      ...activeSavedMap,
      markers: Array.isArray(activeSavedMap.markers)
        ? activeSavedMap.markers
        : [],
    };

    if (isNew) {
      await logMapAction("add", mapToSave);
    }

    await savedMapsService.set(mapToSave);
    closeSavedMapModal();
    await reloadSavedMaps();
  }

  // Delete a saved map
  async function deleteSavedMap(map: SavedMap) {
    const mapToDelete = savedMaps.find((m) => m.id === map.id);
    if (mapToDelete) {
      await logMapAction("delete", mapToDelete);
    }

    // Check if the map being deleted is currently active in edit mode
    const currentEditingMapId = getQueryParam("map");
    const isCurrentlyEditingThisMap =
      activeSavedMap?.id === map.id || currentEditingMapId === map.id;

    await savedMapsService.delete(map);

    // If deleting the actively edited map, exit edit mode
    if (isCurrentlyEditingThisMap) {
      exitEditMode();
    }

    await reloadSavedMaps();
  }

  const value: SavedMapsContextValue = {
    savedMaps,
    loading,
    error,
    reloadSavedMaps,
    createNewMap,
    duplicateSavedMap,
    saveCurrentMap,
    viewSavedMap,
    loadSavedMapForEditing,
    isSavedMapModalOpen,
    activeSavedMap,
    openSavedMapModal,
    closeSavedMapModal,
    saveSavedMap,
    deleteSavedMap,
    updateSavedMapName,
    exitEditMode,
    layers: {
      ...layerManager,
      importLayers: handleImportLayers,
    },
    markers: markerManager,
  };

  return (
    <SavedMapsContext.Provider value={value}>
      {children}
    </SavedMapsContext.Provider>
  );
};
