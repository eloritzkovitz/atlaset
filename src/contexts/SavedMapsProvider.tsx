import { useState, useEffect, type ReactNode } from "react";
import { logUserActivity, useAuth } from "@features/user";
import { useNavigate, useLocation } from "react-router-dom";
import { decodeMapData } from "@features/atlas/export/utils/mapShare";
import {
  normalizeLayers,
  useLayerManager,
  type Layer,
} from "@features/atlas/layers";
import { normalizeMarkers } from "@features/atlas/markers";
import { useMarkerManager } from "@features/atlas/markers/hooks/useMarkerManager";
import { type SavedMap, savedMapsService } from "@features/atlas/saved";
import { SavedMapsContext } from "./SavedMapsContext";

export const SavedMapsProvider = ({ children }: { children: ReactNode }) => {
  const [savedMaps, setSavedMaps] = useState<SavedMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [editingSavedMap, setEditingSavedMap] = useState<SavedMap | null>(null);
  const [isSavedMapModalOpen, setSavedMapModalOpen] = useState(false);

  // Layer manager for saved map layers
  const {
    layers: savedMapLayers,
    setLayers: setSavedMapLayers,
    editingLayer: editingSavedMapLayer,
    setEditingLayer: setEditingSavedMapLayer,
    isEditingLayer: isEditingSavedMapLayer,
    isEditModalOpen: isEditSavedMapLayerModalOpen,
    addLayer,
    removeLayer,
    reorderLayers,
    toggleLayerVisibility,
    openAddLayer,
    openEditLayer,
    saveLayer: saveSavedMapLayer,
    closeLayerModal,
    importLayers: _importLayers,
  } = useLayerManager({
    initialLayers: editingSavedMap?.layers ?? [],
    persistLayers: async (layers) => {
      if (!editingSavedMap) return;
      const updated = { ...editingSavedMap, layers };
      setEditingSavedMap(updated);
      await savedMapsService.set(updated);
    },
  });

  // Marker manager for saved map markers
  const {
    markers: savedMapMarkers,
    setMarkers: setSavedMapMarkers,
    editingMarker: editingSavedMapMarker,
    setEditingMarker: setEditingSavedMapMarker,
    isEditingMarker: isEditingSavedMapMarker,
    isMarkerModalOpen: isEditSavedMapMarkerModalOpen,
    addMarker,
    editMarker,
    removeMarker: removeMarker,
    reorderMarkers,
    toggleMarkerVisibility,
    openAddMarker,
    openEditMarker,
    saveMarker: saveSavedMapMarker,
    closeMarkerModal,
    isAddingMarker,
    startAddingMarker,
    handleMapClickForMarker,
    cancelMarkerCreation,
  } = useMarkerManager({
    initialMarkers: editingSavedMap?.markers ?? [],
    persistMarkers: async (markers) => {
      if (!editingSavedMap) return;
      const updated = { ...editingSavedMap, markers };
      setEditingSavedMap(updated);
      setSavedMapMarkers(markers);
      await savedMapsService.set(updated);
    },
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Watch URL for map/edit and load map for editing on mount or URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mapId = params.get("map");
    const isEdit = params.get("edit") === "true" || params.has("edit");
    if (mapId && isEdit) {
      // Only load if not already loaded or if id changed
      if (!editingSavedMap || editingSavedMap.id !== mapId) {
        loadSavedMapForEditing(mapId);
      }
    } else {
      // If not in edit mode, clear editingSavedMap
      if (editingSavedMap) setEditingSavedMap(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Exit edit mode: remove edit/map from URL and clear editingSavedMap
  function exitEditMode() {
    const params = new URLSearchParams(location.search);
    params.delete("edit");
    params.delete("map");
    navigate(
      `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`,
    );
    setEditingSavedMap(null);
    setSavedMapLayers([]);
  }

  // Reload saved maps
  async function reload() {
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

  // Add or update a saved map
  async function addMap(map: SavedMap) {
    await savedMapsService.set(map);
    await reload();
  }

  // Delete a saved map
  async function deleteMap(id: string) {
    await savedMapsService.delete(id);
    await reload();
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
        setEditingSavedMap(map);
      } else {
        setError(new Error("Map not found"));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  // Open saved map modal
  function openSavedMapModal(map: SavedMap | null = null) {
    setEditingSavedMap(map);
    setSavedMapModalOpen(true);
  }

  // Close saved map modal
  function closeSavedMapModal() {
    setSavedMapModalOpen(false);
    setTimeout(() => {
      if (!isEditSavedMapLayerModalOpen) {
        setEditingSavedMap(null);
      }
    }, 0);
  }

  // Save edited or new saved map
  async function saveSavedMap() {
    if (!editingSavedMap) return;
    const mapToSave = {
      ...editingSavedMap,
      markers: Array.isArray(editingSavedMap.markers)
        ? editingSavedMap.markers
        : [],
    };
    await savedMapsService.set(mapToSave);
    closeSavedMapModal();
    await reload();
  }

  // Import layers into the editing saved map
  async function importLayers(layers: Layer[]) {
    if (!editingSavedMap) return;
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
            mapName: editingSavedMap.name,
          },
          user.uid,
        );
      }
    }
    const updated = { ...editingSavedMap, layers: merged };
    setEditingSavedMap(updated);
    await savedMapsService.set(updated);
    await reload();
  }

  // Keep hook's layers/markers in sync with editingSavedMap
  useEffect(() => {
    if (editingSavedMap) {
      setSavedMapLayers(editingSavedMap.layers ?? []);
      setSavedMapMarkers(editingSavedMap.markers ?? []);
    }
  }, [editingSavedMap, setSavedMapLayers, setSavedMapMarkers]);

  // Initial load
  useEffect(() => {
    reload();
  }, []);

  return (
    <SavedMapsContext.Provider
      value={{
        savedMaps,
        loading,
        error,
        reload,
        addMap,
        deleteMap,
        saveCurrentMap,
        viewSavedMap,
        loadSavedMapForEditing,
        isSavedMapModalOpen,
        editingSavedMap,
        openSavedMapModal,
        closeSavedMapModal,
        saveSavedMap,
        // Layers
        addLayer,
        importLayers,
        saveSavedMapLayer,
        removeLayer,
        reorderLayers,
        toggleLayerVisibility,
        isEditingSavedMapLayer,
        editingSavedMapLayer,
        setEditingSavedMapLayer,
        isEditSavedMapLayerModalOpen,
        openAddLayer,
        openEditLayer,
        closeLayerModal,
        // Markers
        savedMapMarkers,
        setSavedMapMarkers,
        editingSavedMapMarker,
        setEditingSavedMapMarker,
        isEditingSavedMapMarker,
        isEditSavedMapMarkerModalOpen,
        addMarker,
        editMarker,
        removeMarker,
        reorderMarkers,
        toggleMarkerVisibility,
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
