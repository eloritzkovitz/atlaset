import { createContext, useContext } from "react";
import type { SavedMap } from "@features/atlas/export/types";

export interface SavedMapsContextValue {
  savedMaps: SavedMap[];
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
  addMap: (map: SavedMap) => Promise<void>;
  deleteMap: (id: string) => Promise<void>;
}

export const SavedMapsContext = createContext<
  SavedMapsContextValue | undefined
>(undefined);

// Custom hook to use the SavedMapsContext
export const useSavedMaps = () => {
  const ctx = useContext(SavedMapsContext);
  if (!ctx)
    throw new Error("useSavedMaps must be used within a SavedMapsProvider");
  return ctx;
};
