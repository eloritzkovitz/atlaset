import { useMemo } from "react";
import { decodeMapLayers } from "@features/atlas/export/utils/mapShare";

/**
 * Returns shared layer items for the readonly (view-only) map mode.
 * Supports multiple visible layers and colors from the shared map URL.
 */
export function useSharedLayerItems() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const mapParam = params.get("map");
    if (!mapParam) return [];
    const layers = decodeMapLayers(mapParam);
    // Only include visible layers (default to visible if not present)
    return layers
      .filter((layer) => layer.countries && layer.countries.length > 0)
      .flatMap((layer) =>
        layer.countries.map((isoCode) => ({
          isoCode,
          color: layer.color,
          layerId: layer.id,
        }))
      );
  }, []);
}
