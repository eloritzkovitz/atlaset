/**
 * Utility functions for importing and exporting layer files.
 */

import type { Layer } from "../types";
import {
  exportToFile,
  importFromFile,
  parseAndNormalize,
  rgbaToHex,
  serializeItems,
} from "@utils";

/**
 * Parse and normalize one or more layers from JSON string or object.
 * Always returns an array of layers.
 */
export function parseAndNormalizeLayers(jsonOrObj: string | object): Layer[] {
  return parseAndNormalize<Layer>(jsonOrObj, normalizeLayer);
}

/**
 * Serialize one or more layers to a pretty JSON string.
 */
export function serializeLayers(layers: Layer | Layer[]): string {
  return serializeItems<Layer>(layers, ["id", "order", "visible"]);
}

/**
 * Normalize a single layer object.
 * @param o - The object to normalize.
 * @returns A normalized Layer object.
 */
function normalizeLayer(o: Record<string, unknown>): Layer {
  const normalized = { ...o };

  // Convert any RGBA color strings to hex format for consistency
  const colorKeys = ["color", "fillColor", "strokeColor"] as const;
  for (const key of colorKeys) {
    if (
      typeof normalized[key] === "string" &&
      (normalized[key] as string).startsWith("rgba")
    ) {
      normalized[key] = rgbaToHex(normalized[key] as string);
    }
  }

  // Ensure the layer has a unique ID
  if (!normalized.id) {
    normalized.id = crypto.randomUUID();
  }

  return normalized as Layer;
}

/**
 * Import one or more layers from a JSON file input event.
 * @param event - The file input change event.
 * @param importLayers - Callback with array of layers.
 * @param onError - Optional error callback.
 */
export function importLayersFromFile(
  event: React.ChangeEvent<HTMLInputElement>,
  importLayers: (layers: Layer[]) => void,
  onError?: (error: Error) => void,
) {
  return importFromFile<Layer>(
    event,
    parseAndNormalizeLayers,
    importLayers,
    onError,
  );
}

/**
 * Export one or more layers to a JSON file.
 * @param layers - Layer or array of layers to export.
 * @param filename - Optional filename (default: layers.json or <name>.json for single layer)
 */
export function exportLayersToFile(layers: Layer | Layer[], filename?: string) {
  exportToFile<Layer>(
    layers,
    filename,
    ["id", "order", "visible", "listId"],
    "layer",
  );
}
