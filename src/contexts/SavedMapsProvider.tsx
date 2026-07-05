import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { decodeMapData } from "@features/atlas/export/utils/mapShare";
import {
  normalizeLayers,
  useLayerManager,
  type Layer,
} from "@features/atlas/layers";
import { normalizeMarkers } from "@features/atlas/markers";
import { useMarkerManager } from "@features/atlas/markers/hooks/useMarkerManager";
import { type SavedMap, savedMapsService } from "@features/atlas/saved";
import { useMapMode } from "@features/atlas/shared";
import { logUserActivity, useAuth } from "@features/user";
import { SavedMapsContext } from "./SavedMapsContext";

export const SavedMapsProvider = ({ children }: { children: ReactNode }) => {
  const [savedMaps, setSavedMaps] = useState<SavedMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeSavedMap, setActiveSavedMap] = useState<SavedMap | null>(null);
  const [isSavedMapModalOpen, setSavedMapModalOpen] = useState(false);

  const { user } = useAuth();
  const { mapMode, mapId } = useMapMode();
  const navigate = useNavigate();

  // Layer manager for saved map layers
  const {
    layers: savedMapLayers,
    setLayers: setSavedMapLayers,
    editingLayer: activeSavedMapLayer,
    setEditingLayer: setActiveSavedMapLayer,
    isEditingLayer: isEditingSavedMapLayer,
    isEditModalOpen: isEditSavedMapLayerModalOpen,
    addLayer,
    editLayer,
    updateLayerName,
    reorderLayers,
    toggleLayerVisibility,
    duplicateLayer,
    removeLayer,
    openAddLayer,
    openEditLayer,
    saveLayer: saveSavedMapLayer,
    closeLayerModal,
    importLayers: _importLayers,
  } = useLayerManager({
    initialLayers: activeSavedMap?.layers ?? [],
    persistLayers: async (layers) => {
      if (!activeSavedMap) return;
      const updated = { ...activeSavedMap, layers };
      setActiveSavedMap(updated);
      await savedMapsService.set(updated);
    },
  });

  // Marker manager for saved map markers
  const {
    markers: savedMapMarkers,
    setMarkers: setSavedMapMarkers,
    editingMarker: activeSavedMapMarker,
    setEditingMarker: setActiveSavedMapMarker,
    isEditingMarker: isEditingSavedMapMarker,
    isMarkerModalOpen: isEditSavedMapMarkerModalOpen,
    addMarker,
    editMarker,
    updateMarkerName,
    reorderMarkers,
    toggleMarkerVisibility,
    duplicateMarker,
    removeMarker,
    openAddMarker,
    openEditMarker,
    saveMarker: saveSavedMapMarker,
    closeMarkerModal,
    isAddingMarker,
    startAddingMarker,
    handleMapClickForMarker,
    cancelMarkerCreation,
  } = useMarkerManager({
    initialMarkers: activeSavedMap?.markers ?? [],
    persistMarkers: async (markers) => {
      if (!activeSavedMap) return;
      const updated = { ...activeSavedMap, markers };
      setActiveSavedMap(updated);
      setSavedMapMarkers(markers);
      await savedMapsService.set(updated);
    },
  });

  // Reload saved maps
  async function reloadSavedMaps() {
    setLoading(true);
    setError(null);
    try {
      const maps = await savedMapsService.load();
      setSavedMaps(maps);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    reloadSavedMaps();
  }, []);

  // Sync activeSavedMap layers/markers with layer/marker managers
  useEffect(() => {
    if (activeSavedMap) {
      setSavedMapLayers(activeSavedMap.layers ?? []);
      setSavedMapMarkers(activeSavedMap.markers ?? []);
    }
  }, [activeSavedMap, setSavedMapLayers, setSavedMapMarkers]);

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
      if (!isEditSavedMapLayerModalOpen) {
        setActiveSavedMap(null);
      }
    }, 0);
  }

  // Exit edit mode: remove edit/map from URL and clear activeSavedMap
  function exitEditMode() {
    const params = new URLSearchParams(location.search);
    params.delete("edit");
    params.delete("map");
    navigate(
      `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`,
    );
    setActiveSavedMap(null);
    setSavedMapLayers([]);
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

  // Load a saved map for editing
  async function loadSavedMapForEditing(id: string) {
    setLoading(true);
    setError(null);
    try {
      const map = await savedMapsService.get(id);
      if (map) {
        setActiveSavedMap(map);
      } else {
        setError(new Error("Map not found"));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  // Update map name and persist
  async function updateSavedMapName(id: string, newName: string) {
    // Update local state
    setSavedMaps((prev) =>
      prev.map((m) => (m.id === id ? { ...m, name: newName } : m)),
    );
    const mapToUpdate =
      activeSavedMap && activeSavedMap.id === id
        ? { ...activeSavedMap, name: newName }
        : savedMaps.find((m) => m.id === id);

    // Persist updated name
    if (mapToUpdate && mapToUpdate.id) {
      await savedMapsService.set(mapToUpdate);

      // Reload and set activeSavedMap from the new maps
      const maps = await savedMapsService.load();
      setSavedMaps(maps);
      const updated = maps.find((m) => m.id === id);
      if (updated) setActiveSavedMap({ ...updated });
    }
  }

  // Save edited or new saved map
  async function saveSavedMap() {
    if (!activeSavedMap) return;
    const mapToSave = {
      ...activeSavedMap,
      markers: Array.isArray(activeSavedMap.markers)
        ? activeSavedMap.markers
        : [],
    };
    await savedMapsService.set(mapToSave);
    closeSavedMapModal();
    await reloadSavedMaps();
  }

  // Import layers into the editing saved map
  async function importLayers(layers: Layer[]) {
    if (!activeSavedMap) return;
    const before = savedMapLayers;
    const merged = await _importLayers(layers);
    const imported = merged.filter((l) => !before.some((b) => b.id === l.id));
    for (const layer of imported) {
      if (user) {
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
  }

  // Delete a saved map
  async function deleteSavedMap(id: string) {
    await savedMapsService.delete(id);
    await reloadSavedMaps();
  }

  return (
    <SavedMapsContext.Provider
      value={{
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
        updateLayerName,
        // Layers
        saveSavedMapLayer,
        addLayer,
        importLayers,
        editLayer,
        duplicateLayer,
        removeLayer,
        reorderLayers,
        toggleLayerVisibility,
        isEditingSavedMapLayer,
        activeSavedMapLayer,
        setActiveSavedMapLayer,
        isEditSavedMapLayerModalOpen,
        openAddLayer,
        openEditLayer,
        closeLayerModal,
        // Markers
        savedMapMarkers,
        setSavedMapMarkers,
        activeSavedMapMarker,
        setActiveSavedMapMarker,
        isEditingSavedMapMarker,
        isEditSavedMapMarkerModalOpen,
        addMarker,
        editMarker,
        updateMarkerName,
        reorderMarkers,
        toggleMarkerVisibility,
        duplicateMarker,
        removeMarker,
        openAddMarker,
        openEditMarker,
        saveSavedMapMarker,
        closeMarkerModal,
        // Marker creation state/handlers
        isAddingMarker,
        startAddingMarker,
        handleMapClickForMarker,
        cancelMarkerCreation,
        exitEditMode,
      }}
    >
      {children}
    </SavedMapsContext.Provider>
  );
};
