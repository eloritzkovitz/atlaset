import { useState, useEffect, type ReactNode } from "react";
import { SavedMapsContext } from "./SavedMapsContext";
import type { SavedMap } from "@features/atlas/export/types";
import { exportSaveService } from "@features/atlas/export/services/exportSaveService";

export const SavedMapsProvider = ({ children }: { children: ReactNode }) => {
  const [savedMaps, setSavedMaps] = useState<SavedMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  // Load saved maps on mount
  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SavedMapsContext.Provider
      value={{ savedMaps, loading, error, reload, addMap, deleteMap }}
    >
      {children}
    </SavedMapsContext.Provider>
  );
};
