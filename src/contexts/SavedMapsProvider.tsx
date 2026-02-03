import { useState, useEffect, type ReactNode } from "react";
import { decodeMapData } from "@features/atlas/export/utils/mapShare";
import type { SavedMap } from "@features/atlas/export/types";
import { exportSaveService } from "@features/atlas/export/services/exportSaveService";
import { SavedMapsContext } from "./SavedMapsContext";

export const SavedMapsProvider = ({ children }: { children: ReactNode }) => {
  const [savedMaps, setSavedMaps] = useState<SavedMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Modal state for add/edit saved map
  const [isSavedMapModalOpen, setSavedMapModalOpen] = useState(false);
  const [editingSavedMap, setEditingSavedMap] = useState<SavedMap | null>(null);
  const [isEditingSavedMap, setIsEditingSavedMap] = useState(false);

  // Function to reload saved maps
  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const maps = await exportSaveService.load();
      setSavedMaps(maps);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new saved map
  const addMap = async (map: SavedMap) => {
    await exportSaveService.add(map);
    await reload();
  };

  // Function to delete a saved map by ID
  const deleteMap = async (id: string) => {
    await exportSaveService.delete(id);
    await reload();
  };

  // Save current map from URL (open modal for user to confirm/save)
  const saveCurrentMap = () => {
    // Get the map code from the current URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("map");
    if (!code) {
      return;
    }
    const exportData = decodeMapData(code);
    // Open modal with decoded map data, empty name
    openSavedMapModal(
      {
        id: crypto.randomUUID(),
        name: "",
        layers: exportData.layers,
        markers: exportData.markers
          ? exportData.markers.map((m) => ({
              name: m.name ?? "",
              coordinates: m.coordinates,
              color: m.color,
              description: m.description,
            }))
          : [],
        createdAt: new Date().toISOString(),
      },
      false,
    );
  };

  // Open modal for adding or editing a saved map
  const openSavedMapModal = (map: SavedMap | null = null, editing = false) => {
    setEditingSavedMap(map);
    setIsEditingSavedMap(editing);
    setSavedMapModalOpen(true);
  };

  // Close modal and reset state
  const closeSavedMapModal = () => {
    setSavedMapModalOpen(false);
    setEditingSavedMap(null);
  };

  // Handle changes to the saved map being edited
  const handleSavedMapChange = (map: SavedMap) => setEditingSavedMap(map);

  // Save changes to the saved map
  const handleSavedMapSave = async () => {
    if (!editingSavedMap) return;
    // Always ensure markers is an array before saving
    const mapToSave = {
      ...editingSavedMap,
      markers: Array.isArray(editingSavedMap.markers)
        ? editingSavedMap.markers
        : [],
    };
    if (isEditingSavedMap) {
      await exportSaveService.add(mapToSave);
    } else {
      await addMap(mapToSave);
    }
    closeSavedMapModal();
    await reload();
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        isSavedMapModalOpen,
        editingSavedMap,
        isEditingSavedMap,
        openSavedMapModal,
        closeSavedMapModal,
        handleSavedMapChange,
        handleSavedMapSave,
      }}
    >
      {children}
    </SavedMapsContext.Provider>
  );
};
