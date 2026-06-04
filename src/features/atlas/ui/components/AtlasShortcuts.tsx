import { useUI } from "@contexts/UIContext";
import { useMapView } from "@contexts/MapViewContext";
import { useTimeline } from "@contexts/TimelineContext";
import { useKeyHandler } from "@hooks";
import { isAuthenticated } from "@utils/firebase";

/**
 * AtlasShortcuts: Handles keyboard shortcuts specific to the Atlas page/UI.
 * Mount this component only on the Atlas page.
 */
export function AtlasShortcuts() {
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
  const { isReadonly, isEdit, setColorMode } = useMapView();
  const { timelineMode } = useTimeline();

  // Toggle Saved Maps panel with "B"
  useKeyHandler(toggleSavedMaps, ["b", "B"], isAuthenticated());

  // Toggle Countries panel with "C"
  useKeyHandler(toggleCountries, ["c", "C"], true);

  // Toggle Export panel with "E"
  useKeyHandler(toggleExport, ["e", "E"], true);

  // Toggle Filters panel with "F"
  useKeyHandler(toggleFilters, ["f", "F"], true);

  // Toggle Legend with "G"
  useKeyHandler(toggleLegend, ["g", "G"], true);

  // Toggle Layers panel with "L"
  useKeyHandler(toggleLayers, ["l", "L"], true);

  // Toggle Markers panel with "M"
  useKeyHandler(toggleMarkers, ["m", "M"], true);

  // Toggle color modes with "O"
  useKeyHandler(
    () => {
      if (isReadonly || isEdit || timelineMode) return;
      setColorMode((prev) => (prev === "atlas" ? "standard" : "atlas"));
    },
    ["o", "O"],
    true,
  );

  // Toggle Settings panel with "S"
  useKeyHandler(toggleSettings, ["s", "S"], !isReadonly && !isEdit);

  return null;
}
