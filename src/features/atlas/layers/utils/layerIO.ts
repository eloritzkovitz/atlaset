/**
 * Utility functions for importing and exporting layer files.
 */

import type { Layer } from "../types";
import { rgbaToHex } from "@utils/color";

/**
 * Parse and normalize one or more layers from JSON string or object.
 * Always returns an array of layers.
 */
export function parseAndNormalizeLayers(jsonOrObj: string | object): Layer[] {
  const obj = typeof jsonOrObj === "string" ? JSON.parse(jsonOrObj) : jsonOrObj;
  if (Array.isArray(obj)) {
    return obj.map(normalizeLayer);
  } else {
    return [normalizeLayer(obj)];
  }
}

/**
 * Serialize one or more layers to a pretty JSON string.
 */
export function serializeLayers(layers: Layer | Layer[]): string {
  const arr = Array.isArray(layers) ? layers : [layers];
  const withoutIdOrderVisible = arr.map((layer) => {
    const rest: Record<string, unknown> = { ...layer };
    delete rest.id;
    delete rest.order;
    delete rest.visible;
    return rest;
  });
  return JSON.stringify(withoutIdOrderVisible, null, 2);
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
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    try {
      const layers = parseAndNormalizeLayers(e.target?.result as string);
      importLayers(layers);
    } catch (err) {
      alert(
        (err as Error)?.message || "Failed to import layers. Invalid JSON.",
      );
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

/**
 * Export one or more layers to a JSON file.
 * @param layers - Layer or array of layers to export.
 * @param filename - Optional filename (default: layers.json or <name>.json for single layer)
 */
export function exportLayersToFile(layers: Layer | Layer[], filename?: string) {
  if (!layers) return;
  const arr = Array.isArray(layers) ? layers : [layers];
  const pretty = serializeLayers(layers);
  const blob = new Blob([pretty], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    filename ||
    (arr.length === 1 ? `${arr[0].name || "layer"}.json` : "layers.json");
  a.click();
  URL.revokeObjectURL(url);
}
