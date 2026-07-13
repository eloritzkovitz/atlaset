import { useKeyHandler } from "@hooks";
import { useAtlasActions } from "../../shared/hooks/useAtlasActions";

/** Handles keyboard shortcuts specific to the Atlas page/UI. */
export function AtlasShortcuts() {
  const { actions, conditions } = useAtlasActions();

  useKeyHandler(actions.toggleSavedMaps, ["b", "B"], conditions.savedmaps);
  useKeyHandler(actions.toggleCountries, ["c", "C"], conditions.countries);
  useKeyHandler(actions.toggleExport, ["e", "E"], conditions.export);
  useKeyHandler(actions.toggleFilters, ["f", "F"], conditions.filters);
  useKeyHandler(actions.toggleLegend, ["g", "G"], conditions.legend);
  useKeyHandler(actions.toggleLayers, ["l", "L"], conditions.layers);
  useKeyHandler(actions.toggleMarkers, ["m", "M"], conditions.markers);
  useKeyHandler(actions.toggleAtlasMode, ["a", "A"], conditions.atlasMode);
  useKeyHandler(actions.toggleSettings, ["s", "S"], conditions.settings);

  return null;
}
