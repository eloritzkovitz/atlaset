/**
 * Utility functions for importing and exporting marker files.
 */

import {
  parseAndNormalize,
  serializeItems,
  importFromFile,
  exportToFile,
} from "@utils";
import type { Marker } from "../types";

/**
 * Parse and normalize one or more markers from JSON string or object.
 * Always returns an array of Marker.
 */
export function parseAndNormalizeMarkers(jsonOrObj: string | object): Marker[] {
  return parseAndNormalize<Marker>(jsonOrObj, normalizeMarker);
}

/**
 * Serialize one or more markers to a pretty JSON string (always as an array in JSON).
 * Omits 'id', 'order', and 'visible' from each marker.
 */
export function serializeMarkers(markers: Marker | Marker[]): string {
  return serializeItems<Marker>(markers, ["id", "order", "visible"]);
}

/**
 * Normalize a single marker object.
 */
function normalizeMarker(o: Record<string, unknown>): Marker {
  const normalized: Record<string, unknown> = { ...o };
  if (!normalized.id) normalized.id = crypto.randomUUID();
  return normalized as Marker;
}

/**
 * Import one or more markers from a JSON file input event.
 * @param event - The file input change event.
 * @param existingMarkers - The array of existing markers.
 * @param importMarkers - Callback with array of markers.
 */
export function importMarkersFromFile(
  event: React.ChangeEvent<HTMLInputElement>,
  existingMarkers: Marker[],
  importMarkers: (markers: Marker[]) => void,
) {
  importFromFile<Marker>(
    event,
    (json) => {
      const parsed = parseAndNormalizeMarkers(json);

      // Filter out duplicates based on isoCode, keeping existing markers and adding new unique ones
      const existingIsoCodes = new Set(
        existingMarkers
          .map((m) => m.isoCode)
          .filter((code): code is string => Boolean(code)),
      );

      // Filter out new markers that have an isoCode already present in existing markers
      const uniqueNewMarkers = parsed.filter((marker) => {
        if (existingIsoCodes.has(marker.isoCode)) return false;
        existingIsoCodes.add(marker.isoCode);
        return true;
      });

      // Merge existing markers with unique new markers and assign order based on their position in the combined array
      return [...existingMarkers, ...uniqueNewMarkers].map((marker, index) => ({
        ...marker,
        order: index,
      }));
    },
    importMarkers,
  );
}

/**
 * Export one or more markers to a JSON file.
 * @param markers Marker or array of markers to export.
 * @param filename Optional filename (default: markers.json or <name>.json for single marker)
 */
export function exportMarkersToFile(
  markers: Marker | Marker[],
  filename?: string,
) {
  exportToFile<Marker>(markers, filename, ["id", "order", "visible"], "marker");
}
