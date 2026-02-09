/**
 * Utility functions for importing and exporting marker files.
 */

import {
  parseAndNormalize,
  serializeItems,
  importFromFile,
  exportToFile,
} from "@utils/json";
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
 * @param event The file input change event.
 * @param importMarkers Callback with array of markers.
 */
export function importMarkersFromFile(
  event: React.ChangeEvent<HTMLInputElement>,
  importMarkers: (markers: Marker[]) => void,
) {
  importFromFile<Marker>(
    event,
    (json) => parseAndNormalizeMarkers(json),
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
