/**
 * Utility functions for managing layers.
 */

import type { AnyLayer, TimelineLayer } from "../types";

/**
 * Type guard to check if an layer is a TimelineLayer.
 * @param layer - The layer to check.
 * @returns True if the layer is a TimelineLayer, false otherwise.
 */
export function isTimelineLayer(
  layer: AnyLayer
): layer is TimelineLayer {
  return (layer as TimelineLayer).timelineEnabled === true;
}

/**
 * Generates default layer selections mapping each layer ID to "all".
 * @param layers- The array of layers.
 * @returns A record mapping layer IDs to the string "all".
 */
export function getDefaultLayerSelections(layers: AnyLayer[]) {
  return layers.reduce((acc, layer) => {
    acc[layer.id] = "all";
    return acc;
  }, {} as Record<string, string>);
}
