import { useSharedMapInfo } from "@features/atlas/export/hooks/useSharedMapInfo";
import { getLayerItems } from "../utils/layerRender";

/**
 * Returns shared layer items for the readonly (view-only) map mode.
 * Supports multiple visible layers and colors from the shared map URL.
 */
export function useSharedLayerItems() {
  const { layers } = useSharedMapInfo();
  if (!layers) return [];
  return layers.flatMap((layer, idx) =>
    getLayerItems({
      ...layer,
      id: typeof layer.id === "string" ? layer.id : `shared-layer-${idx}`,
      visible: typeof layer.visible === "boolean" ? layer.visible : true,
      countries: Array.isArray(layer.countries)
        ? layer.countries
        : layer.countries != null
        ? [layer.countries]
        : [],
    })
  );
}
