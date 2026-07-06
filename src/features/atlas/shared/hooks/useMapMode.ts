import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { MapMode } from "../types";

/**
 * Manages map mode based on URL parameters and provides a setter for map mode.
 */
export function useMapMode() {
  const location = useLocation();
  const navigate = useNavigate();

  // Compute map mode and related state from URL parameters
  const urlState = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const hasMapParam = params.has("map");
    const isEmbed = params.has("embed");
    const isEdit = params.get("edit") === "true" || params.has("edit");

    const mapId = params.get("map") || undefined;

    let computedMode: MapMode;
    if (isEdit) {
      computedMode = "edit";
    } else {
      computedMode = hasMapParam || isEmbed ? "readonly" : "view";
    }

    return {
      mapMode: computedMode,
      mapId,
      isEmbed,
      isEdit,
      isReadonly: computedMode === "readonly",
    };
  }, [location.search]);

  // Setter for map mode that updates the URL parameters accordingly
  const setMapMode = useCallback(
    (nextMode: MapMode) => {
      const params = new URLSearchParams(location.search);

      if (nextMode === "edit") {
        params.set("edit", "true");
      } else if (nextMode === "readonly") {
        params.delete("edit");
        if (!params.has("map")) {
          params.set("map", urlState.mapId || "active");
        }
      } else {
        params.delete("edit");
        params.delete("map");
        params.delete("embed");
      }

      navigate({ search: params.toString() }, { replace: true });
    },
    [location.search, urlState.mapId, navigate],
  );

  return {
    mapMode: urlState.mapMode,
    mapId: urlState.mapId,
    isEmbed: urlState.isEmbed,
    isEdit: urlState.isEdit,
    isReadonly: urlState.isReadonly,
    setMapMode,
  };
}
