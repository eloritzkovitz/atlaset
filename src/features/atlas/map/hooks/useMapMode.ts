import { useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useMapView } from "@contexts/MapViewContext";
import type { MapMode } from "@features/atlas/shared";

/**
 * Manages map mode based on URL parameters and provides a setter for map mode.
 */
export function useMapMode() {
  const location = useLocation();
  const { setMapMode: setMapModeContext } = useMapView();

  // Parse URL parameters to determine map mode and map ID
  const { mapMode, mapId } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const isReadonly = params.has("map") && !params.has("edit");
    const isEmbed = params.has("embed");
    const isEdit = params.get("edit") === "true" || params.has("edit");

    // Determine map mode based on parameters
    const mapId = params.get("map") || undefined;
    let mapMode: MapMode;
    if (isEdit) {
      mapMode = "edit";
    } else {
      mapMode = isReadonly || isEmbed ? "readonly" : "view";
    }
    return { mapMode, mapId };
  }, [location.search]);

  // Keep context in sync
  useEffect(() => {
    setMapModeContext(mapMode);
  }, [mapMode, setMapModeContext]);

  // Expose a setter for mapMode that only updates context
  const setMapMode = useCallback(
    (mode: MapMode) => {
      setMapModeContext(mode);
    },
    [setMapModeContext],
  );

  return { mapMode, mapId, setMapMode };
}
