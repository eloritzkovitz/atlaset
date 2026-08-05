/**
 * Utilities for layer rendering.
 */

import type { Layer, LayerItem } from "../types";

/**
 * Gets layer items from a layer definition.
 * @param layer - The layer definition containing countries, color, and name.
 * @returns Array of layer items with isoCode, color, and layerId.
 */
export function getLayerItems(layer: Layer): LayerItem[] {
  return layer.countries.map((isoCode) => ({
    isoCode,
    color: layer.color,
    layerId: layer.id,
  }));
}

/**
 * Groups layer items by isoCode for layer selection/stacking.
 * @param layerItems - The list of layer items.
 * @returns A record mapping isoCodes to their layer items.
 */
export function groupLayerItemsByIsoCode(layerItems: LayerItem[] = []) {
  const layerGroups: Record<string, LayerItem[]> = {};
  for (const item of layerItems) {
    const code = (item.isoCode || "").toUpperCase();
    if (!code) continue;
    if (!layerGroups[code]) layerGroups[code] = [];
    layerGroups[code].push(item);
  }
  return layerGroups;
}

/**
 * Gets the topmost layer color for a given set of layer items.
 * @param layerItems - The list of layer items.
 * @param fallbackColor - The fallback color to use if no layers are present.
 * @returns The color of the topmost layer or the fallback color.
 */
export function getTopmostLayerColor(
  layerItems: LayerItem[] = [],
  fallbackColor?: string,
) {
  const layerColors = layerItems
    .map((o) => o.color)
    .filter((c): c is string => typeof c === "string" && c.length > 0);

  if (layerColors.length === 0) return fallbackColor;

  // The last item in the array represents the topmost layer on the stack
  return layerColors[layerColors.length - 1];
}
