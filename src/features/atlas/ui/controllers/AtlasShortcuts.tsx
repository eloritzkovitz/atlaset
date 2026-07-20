import { useAccessibility } from "@features/settings";
import { useKeyHandler } from "@hooks";
import { useAtlasActions } from "../../shared/hooks/useAtlasActions";

/** Handles keyboard shortcuts specific to the Atlas page/UI. */
export function AtlasShortcuts() {
  const { singleKeyShortcutsEnabled } = useAccessibility();
  const { actions, conditions: c } = useAtlasActions();

  // Common options for single-character shortcuts
  const opts = (enabled: boolean) => ({
    enabled,
    allowSingleKeyShortcuts: singleKeyShortcutsEnabled,
  });

  useKeyHandler(actions.toggleSavedMaps, ["b", "B"], opts(c.savedmaps));
  useKeyHandler(actions.toggleCountries, ["c", "C"], opts(c.countries));
  useKeyHandler(actions.toggleExport, ["e", "E"], opts(c.export));
  useKeyHandler(actions.toggleFilters, ["f", "F"], opts(c.filters));
  useKeyHandler(actions.toggleLegend, ["g", "G"], opts(c.legend));
  useKeyHandler(actions.toggleLayers, ["l", "L"], opts(c.layers));
  useKeyHandler(actions.toggleMarkers, ["m", "M"], opts(c.markers));
  useKeyHandler(actions.toggleAtlasMode, ["a", "A"], opts(c.atlasMode));
  useKeyHandler(actions.toggleSettings, ["s", "S"], opts(c.settings));

  return null;
}
