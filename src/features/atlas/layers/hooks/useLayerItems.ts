import { useMemo } from "react";
import { getLayerItems } from "../utils/layerRender";
import type { Layer } from "../types";

/**
 * Retrieves layer items that are marked as visible.
 * @param layers - Array of layer objects.
 * @returns An array of layer items that are visible.
 */
export function useLayerItems(layers: Layer[]) {
  return useMemo(
    () => layers.filter((o) => o.visible).flatMap(getLayerItems),
    [layers]
  );
}
