/**
 * Utility functions for importing and exporting layer files.
 */

import type { Layer } from "../types";
import { rgbaToHex } from "@utils/color";

/**
 * Imports layers from a JSON file.
 * @param event The file input change event.
 * @param importLayers The function to merge and persist layers.
 * @returns void
 */
export function importLayersFromFile(
  event: React.ChangeEvent<HTMLInputElement>,
  importLayers: (layers: Layer[]) => void
) {
  const file = event.target.files?.[0];
  // If no file selected, do nothing
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target?.result as string);
      if (Array.isArray(imported)) {
        // Assign an id if missing and normalize color fields
        const layersWithIds = imported.map((o) => {
          // Normalize color fields if present
          const normalizeColor = (color: string) => {
            if (typeof color === "string" && color.startsWith("rgba")) {
              return rgbaToHex(color);
            }
            return color;
          };          
          const normalized = { ...o };
          if (normalized.color)
            normalized.color = normalizeColor(normalized.color);
          if (normalized.fillColor)
            normalized.fillColor = normalizeColor(normalized.fillColor);
          if (normalized.strokeColor)
            normalized.strokeColor = normalizeColor(normalized.strokeColor);
          return normalized.id
            ? normalized
            : { ...normalized, id: crypto.randomUUID() };
        });
        importLayers(layersWithIds);
      } else {
        alert("Invalid layers file format.");
      }
    } catch {
      alert("Failed to import layers. Invalid JSON.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

/**
 * Exports layers to a JSON file.
 * @param layers The layers data to export.
 * @returns void
 */
export function exportLayersToFile(layers: Layer[]) {
  if (!layers) return;
  const layersWithoutId = layers.map(({ ...rest }) => rest);
  const pretty = JSON.stringify(layersWithoutId, null, 2);
  const blob = new Blob([pretty], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "layers.json";
  a.click();
  URL.revokeObjectURL(url);
}
