/**
 * Utility functions for managing layers.
 */

import type { AnyLayer, Layer, LayerSelections, TimelineLayer } from "../types";

/**
 * Type guard to check if an layer is a TimelineLayer.
 * @param layer - The layer to check.
 * @returns True if the layer is a TimelineLayer, false otherwise.
 */
export function isTimelineLayer(layer: AnyLayer): layer is TimelineLayer {
  return (layer as TimelineLayer).timelineEnabled === true;
}

/**
 * Normalizes an array of layers from any source.
 * @param layers - The array of layers to normalize.
 * @returns An array of normalized Layer objects.
 */
export function normalizeLayers(
  layers: (Layer | unknown | undefined)[] | undefined,
): Layer[] | undefined {
  if (!Array.isArray(layers)) return undefined;

  return layers.map((layer) => {
    const l = (layer ?? {}) as Partial<Layer> & {
      name?: string;
      color?: string;
      countries?: string[] | string;
    };

    // Only assign a UUID if id is missing or empty, never overwrite a valid id
    let id = l.id;
    if (typeof id !== "string" || id.length === 0) {
      id = crypto.randomUUID();
    }

    return {
      ...l,
      id,
      visible: typeof l.visible === "boolean" ? l.visible : true,
      name: typeof l.name === "string" ? l.name : "",
      color: typeof l.color === "string" ? l.color : "",
      countries: Array.isArray(l.countries)
        ? l.countries
        : typeof l.countries === "string"
          ? [l.countries]
          : [],
    };
  });
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
  }, {} as LayerSelections);
}

/**
 * Filters ISO codes based on layer selections.
 * @param isoCodes - List of all ISO codes.
 * @param layers - List of all layers.
 * @param layerSelections - Current layer selections.
 * @returns Filtered list of ISO codes.
 */
export function getLayerFilteredIsoCodes(
  isoCodes: string[],
  layers: Layer[],
  layerSelections: LayerSelections,
) {
  return layers.reduce((accIsoCodes, layer) => {
    const selection = layerSelections[layer.id] || "all";
    if (selection === "only") {
      return accIsoCodes.filter((iso) => layer.countries.includes(iso));
    }
    if (selection === "exclude") {
      return accIsoCodes.filter((iso) => !layer.countries.includes(iso));
    }
    return accIsoCodes;
  }, isoCodes as string[]);
}
