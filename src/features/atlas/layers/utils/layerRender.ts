/**
 * Utilities for layer rendering.
 */

import { blendColors } from "@utils/color";
import { VISITED_LAYER_ID } from "../constants/layers";
import type { Layer, LayerItem } from "../types";

/**
 * Gets layer items from a layer definition.
 * @param layer - The layer definition containing countries, color, and name.
 * @returns Array of layer items with isoCode and color.
 */
export function getLayerItems(layer: Layer): LayerItem[] {
  return layer.countries.map((isoCode) => ({
    isoCode,
    color: layer.color,
    layerId: layer.id,
  }));
}

/** Groups layer items by isoCode for blending/stacking.
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

/** Returns a blended color for a list of layer items.
 * If no layer colors, returns the fallback color.
 * @param layerItems - The layer items for a country.
 * @param fallbackColor - The color to return if no layers.
 * @returns The blended color or fallback color.
 */
export function getBlendedLayerColor(
  layerItems: LayerItem[] = [],
  fallbackColor?: string
) {
  // Prioritize visited-countries layer
  const visited = layerItems.find(o => o.layerId === VISITED_LAYER_ID);
  if (visited) return visited.color;

  // Otherwise, blend or pick the top-most layer
  const layerColors = layerItems
    .map((o) => o.color)
    .filter((c): c is string => typeof c === "string" && c.length > 0);

  if (layerColors.length === 0) return fallbackColor;
  if (layerColors.length === 1) return layerColors[0];

  // preserve stacking order by reversing
  return blendColors([...layerColors].reverse());
}
