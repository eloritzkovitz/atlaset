/**
 * Utility functions for importing and exporting overlay files.
 */

import type { Overlay } from "@types";

/**
 * Imports overlays from a JSON file.
 * @param event The file input change event.
 * @param importOverlays The function to merge and persist overlays.
 * @returns void
 */
export function importOverlaysFromFile(
  event: React.ChangeEvent<HTMLInputElement>,
  importOverlays: (overlays: Overlay[]) => void
) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target?.result as string);
      if (Array.isArray(imported)) {
        // Assign an id if missing
        const overlaysWithIds = imported.map((o) =>
          o.id ? o : { ...o, id: crypto.randomUUID() }
        );
        importOverlays(overlaysWithIds);
      } else {
        alert("Invalid overlays file format.");
      }
    } catch {
      alert("Failed to import overlays. Invalid JSON.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

/**
 * Exports overlays to a JSON file.
 * @param overlays The overlays data to export.
 * @returns void
 */
export function exportOverlaysToFile(overlays: Overlay[]) {
  if (!overlays) return;
  const overlaysWithoutId = overlays.map(({ ...rest }) => rest);
  const pretty = JSON.stringify(overlaysWithoutId, null, 2);
  const blob = new Blob([pretty], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "overlays.json";
  a.click();
  URL.revokeObjectURL(url);
}
