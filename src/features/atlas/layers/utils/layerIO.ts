/**
 * Utility functions for importing and exporting layer files.
 */

import type { Layer } from "../types";
import { rgbaToHex } from "@utils/color";
import {
  parseAndNormalize,
  serializeItems,
  importFromFile,
  exportToFile,
} from "@utils/json";

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
 * - Converts rgba colors to hex.
 * - Ensures an id is present (generates one if missing).
 */
function normalizeLayer(o: Record<string, unknown>): Layer {
  const normalizeColor = (color: unknown) => {
    if (typeof color === "string" && color.startsWith("rgba")) {
      return rgbaToHex(color);
    }
    return color;
  };
  const normalized: Record<string, unknown> = { ...o };
  if ("color" in normalized && typeof normalized.color === "string") {
    normalized.color = normalizeColor(normalized.color);
  }
  if ("fillColor" in normalized && typeof normalized.fillColor === "string") {
    normalized.fillColor = normalizeColor(normalized.fillColor);
  }
  if (
    "strokeColor" in normalized &&
    typeof normalized.strokeColor === "string"
  ) {
    normalized.strokeColor = normalizeColor(normalized.strokeColor);
  }
  if (!normalized.id) normalized.id = crypto.randomUUID();
  return normalized as Layer;
}

/**
 * Import one or more layers from a JSON file input event.
 * @param event - The file input change event.
 * @param importLayers - Callback with array of layers.
 */
export function importLayersFromFile(
  event: React.ChangeEvent<HTMLInputElement>,
  importLayers: (layers: Layer[]) => void,
) {
  importFromFile<Layer>(
    event,
    (json) => parseAndNormalizeLayers(json),
    importLayers,
  );
}

/**
 * Export one or more layers to a JSON file.
 * @param layers - Layer or array of layers to export.
 * @param filename - Optional filename (default: layers.json or <name>.json for single layer)
 */
export function exportLayersToFile(layers: Layer | Layer[], filename?: string) {
  exportToFile<Layer>(layers, filename, ["id", "order", "visible"], "layer");
}
