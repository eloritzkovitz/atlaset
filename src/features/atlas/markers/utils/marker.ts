import type { Marker } from "../types";

/**
 * Normalizes an array of markers from any source.
 * @param markers - The array of markers to normalize.
 * @returns An array of normalized Marker objects.
 */
export function normalizeMarkers(
  markers: (Marker | unknown | undefined)[] | undefined,
): Marker[] | undefined {
  if (!Array.isArray(markers)) return undefined;

  return markers.map((m, idx) => {
    const marker = (m ?? {}) as Partial<Marker>;

    return {
      id: typeof marker.id === "string" ? marker.id : `shared-marker-${idx}`,
      name: typeof marker.name === "string" ? marker.name : `Marker ${idx + 1}`,
      isoCode: typeof marker.isoCode === "string" ? marker.isoCode : "",
      color: typeof marker.color === "string" ? marker.color : "",
      notes: typeof marker.notes === "string" ? marker.notes : "",
      visible: typeof marker.visible === "boolean" ? marker.visible : true,
    };
  });
}
