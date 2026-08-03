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
 * Serialize one or more markers to a pretty JSON string.
 */
export function serializeMarkers(markers: Marker | Marker[]): string {
  return serializeItems<Marker>(markers, ["id", "order", "visible"]);
}

/**
 * Normalize a single marker object.
 */
function normalizeMarker(o: Record<string, unknown>): Marker {
  const normalized = { ...o };
  if (!normalized.id) {
    normalized.id = crypto.randomUUID();
  }
  return normalized as Marker;
}

/**
 * Import one or more markers from a JSON file input event.
 * @param event - The file input change event.
 * @param existingMarkers - The array of existing markers.
 * @param importMarkers - Callback with array of merged markers.
 * @param onError - Optional callback triggered on JSON parsing error.
 */
export function importMarkersFromFile(
  event: React.ChangeEvent<HTMLInputElement>,
  existingMarkers: Marker[],
  importMarkers: (markers: Marker[]) => void,
  onError?: (error: Error) => void,
) {
  return importFromFile<Marker>(
    event,
    (json) => {
      const parsed = parseAndNormalizeMarkers(json);

      // Create a set of existing ISO codes for quick lookup
      const existingIsoCodes = new Set(
        existingMarkers
          .map((m) => m.isoCode)
          .filter((code): code is string => Boolean(code)),
      );

      // Track unique ISO codes within the imported batch to avoid duplicate incoming entries
      const seenImportedCodes = new Set<string>();

      const uniqueNewMarkers = parsed.filter((marker) => {
        if (
          !marker.isoCode ||
          existingIsoCodes.has(marker.isoCode) ||
          seenImportedCodes.has(marker.isoCode)
        ) {
          return false;
        }
        seenImportedCodes.add(marker.isoCode);
        return true;
      });

      return [...existingMarkers, ...uniqueNewMarkers].map((marker, index) => ({
        ...marker,
        order: index,
      }));
    },
    importMarkers,
    onError,
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
  if (!markers) return;
  exportToFile<Marker>(markers, filename, ["id", "order", "visible"], "marker");
}
