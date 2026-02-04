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
      coordinates:
        Array.isArray(marker.coordinates) && marker.coordinates.length === 2
          ? (marker.coordinates as [number, number])
          : [0, 0],
      color: typeof marker.color === "string" ? marker.color : undefined,
      description: marker.description,
      visible: typeof marker.visible === "boolean" ? marker.visible : true,
    };
  });
}
