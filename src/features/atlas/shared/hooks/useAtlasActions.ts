import { useMapView } from "@contexts/MapViewContext";
import { useSavedMaps } from "@contexts/SavedMapsContext";
import { useTimeline } from "@contexts/TimelineContext";
import { useUI } from "@contexts/UIContext";
import { isAuthenticated } from "@lib/firebase";

/**
 * Provides actions and conditions for the Atlas toolbar based on the current state of the application.
 * @returns An object containing conditions, actions, and state flags for the Atlas toolbar.
 */
export function useAtlasActions() {
  const { exitEditMode } = useSavedMaps();
  const { isAtlasActive, isEdit, isReadonly, setColorMode } = useMapView();
  const { timelineMode, setTimelineMode } = useTimeline();
  const {
    toggleCountries,
    toggleExport,
    toggleFilters,
    toggleLegend,
    toggleLayers,
    toggleMarkers,
    toggleSavedMaps,
    toggleSettings,
  } = useUI();

  // Conditions for showing/hiding actions based on the current state
  const conditions = {
    countries: true,
    layers: true,
    markers: true,
    filters: true,
    export: true,
    atlasMode: !isReadonly && !isEdit && !timelineMode,
    legend: !isAtlasActive,
    savedmaps: isAuthenticated(),
    timeline: !isReadonly && !isEdit && isAuthenticated(),
    settings: !isReadonly && !isEdit,
    exit: isReadonly || isEdit,
  };

  // Actions for the Atlas toolbar, including toggling panels and modes
  const actions = {
    toggleCountries: toggleCountries,
    toggleLayers: toggleLayers,
    toggleMarkers: toggleMarkers,
    toggleFilters: toggleFilters,
    toggleExport: toggleExport,
    toggleLegend: toggleLegend,
    toggleSavedMaps: toggleSavedMaps,
    toggleSettings: toggleSettings,
    toggleAtlasMode: () => {
      if (!conditions.atlasMode) return;
      setColorMode((prev) => (prev === "atlas" ? "standard" : "atlas"));
    },
    toggleTimelineMode: () => {
      setTimelineMode(!timelineMode);
    },
    handleExit: () => {
      if (typeof exitEditMode === "function") {
        exitEditMode();
      } else {
        const url = new URL(window.location.href);
        if (url.pathname === "/atlas") {
          url.searchParams.delete("map");
          window.location.href = url.pathname + url.search;
        } else {
          window.location.href = "/atlas";
        }
      }
    },
  };

  return {
    conditions,
    actions,
    isAtlasActive,
    isEdit,
    isReadonly,
    timelineMode,
  };
}
