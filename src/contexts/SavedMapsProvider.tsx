import { useState, useEffect, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { decodeMapData } from "@features/atlas/export/utils/mapShare";
import { type SavedMap, savedMapsService } from "@features/atlas/saved";
import { normalizeLayers } from "@features/atlas/layers/utils/layer";
import { normalizeMarkers } from "@features/atlas/markers/utils/markers";
import { SavedMapsContext } from "./SavedMapsContext";
import type { Layer } from "@features/atlas/layers";

export const SavedMapsProvider = ({ children }: { children: ReactNode }) => {
  const [savedMaps, setSavedMaps] = useState<SavedMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [editingSavedMap, setEditingSavedMap] = useState<SavedMap | null>(null);
  const [isSavedMapModalOpen, setSavedMapModalOpen] = useState(false);
  const [editingSavedMapLayer, setEditingSavedMapLayer] =
    useState<Layer | null>(null);
  const [isEditSavedMapLayerModalOpen, setEditSavedMapLayerModalOpen] =
    useState(false);

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

  // Whether a saved map layer is being edited
  const isEditingSavedMapLayer = !!editingSavedMapLayer;

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

  // Modal handlers
  function openSavedMapModal(map: SavedMap | null = null) {
    setEditingSavedMap(map);
    setSavedMapModalOpen(true);
  }

  // Close modal
  function closeSavedMapModal() {
    setSavedMapModalOpen(false);
    // Only clear editingSavedMap if no layer modal is open
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

  // Layer array operations
  function importLayers(layers: Layer[]) {
    if (!editingSavedMap) return;
    setEditingSavedMap({ ...editingSavedMap, layers });
  }

  // Reorder layers
  function reorderLayers(layers: Layer[]) {
    if (!editingSavedMap) return;
    setEditingSavedMap({ ...editingSavedMap, layers });
  }

  // Toggle layer visibility
  function toggleLayerVisibility(layerId: string) {
    if (!editingSavedMap) return;
    setEditingSavedMap({
      ...editingSavedMap,
      layers: editingSavedMap.layers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer,
      ),
    });
  }

  // Remove a layer
  function removeLayer(layerId: string) {
    if (!editingSavedMap) return;
    setEditingSavedMap({
      ...editingSavedMap,
      layers: editingSavedMap.layers.filter((layer) => layer.id !== layerId),
    });
  }

  // Per-layer modal handlers
  function openEditSavedMapLayerModal(layer: Layer) {
    if (!editingSavedMap) {
      console.warn(
        "[openEditSavedMapLayerModal] called with no editingSavedMap",
        { layer },
      );
      return;
    }
    // Only allow editing a layer that exists in the current saved map
    const found = editingSavedMap.layers.find((l) => l.id === layer.id);
    if (!found) {
      console.warn(
        "[openEditSavedMapLayerModal] layer not found in current editingSavedMap",
        { layer, editingSavedMap },
      );
      return;
    }
    setEditingSavedMapLayer(found);
    setEditSavedMapLayerModalOpen(true);
  }

  // Close per-layer modal
  function closeSavedMapLayerModal() {
    setEditingSavedMapLayer(null);
    setEditSavedMapLayerModalOpen(false);
  }

  // Save edited saved map layer
  async function saveSavedMapLayer() {
    if (!editingSavedMap || !editingSavedMapLayer) {
      return;
    }
    const updatedMap = {
      ...editingSavedMap,
      layers: editingSavedMap.layers.map((layer) =>
        layer.id === editingSavedMapLayer.id ? editingSavedMapLayer : layer,
      ),
    };
    setEditingSavedMap(updatedMap);
    await savedMapsService.set(updatedMap);
    setEditingSavedMapLayer(null);
    setTimeout(() => {
      closeSavedMapLayerModal();
    }, 0);
    await reload();
  }

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
        importLayers,
        reorderLayers,
        toggleLayerVisibility,
        removeLayer,
        isEditingSavedMapLayer,
        editingSavedMapLayer,
        setEditingSavedMapLayer,
        isEditSavedMapLayerModalOpen,
        openEditSavedMapLayerModal,
        closeSavedMapLayerModal,
        saveSavedMapLayer,
        exitEditMode,
      }}
    >
      {children}
    </SavedMapsContext.Provider>
  );
};
