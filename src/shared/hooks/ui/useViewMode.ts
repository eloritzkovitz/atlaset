import { useState, useCallback } from "react";
import type { ViewMode } from "@types";

/**
 * Manages the view mode state for components that can toggle between "grid" and "list" views.
 * @param initialView - The initial view mode, either "grid" or "list". Defaults to "grid".
 * @returns An object containing the current view mode, a setter for the view mode, a toggle function, and boolean flags for each view type.
 */
export function useViewMode(initialView: ViewMode = "grid") {
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  }, []);

  return {
    viewMode,
    setViewMode,
    toggleViewMode,
    isGridView: viewMode === "grid",
    isListView: viewMode === "list",
  };
}
