/**
 * Utilities to encode and decode map data for sharing via URL parameters.
 */

import type { Layer } from "@features/atlas/layers/types";
import type { Marker } from "@features/atlas/markers/types";
import type { DecodedMapData, SharedMapData } from "../types";

/**
 * Encode map data as a base64 string.
 * @param mapData Object with layers and optional markers, mapName, and sharer
 * @returns Base64 encoded string
 */
export function encodeMapData(mapData: SharedMapData): string {
  // Serialize layers
  const layerStrings = mapData.layers
    .map((l) =>
      [
        encodeURIComponent(l.name),
        encodeURIComponent(l.color),
        l.countries.map(encodeURIComponent).join(","),
      ].join(":"),
    )
    .join(";");

  // Serialize markers
  let markerString = "";
  if (Array.isArray(mapData.markers)) {
    markerString = mapData.markers
      .map((m) =>
        [
          encodeURIComponent(m.name ?? ""),
          encodeURIComponent(m.isoCode ?? ""),
          encodeURIComponent(m.color ?? ""),
          encodeURIComponent(m.notes ?? ""),
        ].join(","),
      )
      .join("|");
  }

  // Combine all parts
  const parts = [
    mapData.mapName ? encodeURIComponent(mapData.mapName) : "",
    mapData.sharer ? encodeURIComponent(mapData.sharer) : "",
    layerStrings,
    markerString,
  ];
  const combined = parts.join("||");
  return btoa(combined);
}

/**
 * Decode a base64 string into map data (layers and optional markers)
 * @param code Base64 encoded string
 * @returns Object with layers and optional markers
 */
export function decodeMapData(code: string): DecodedMapData {
  try {
    const decoded = atob(code);
    const parts = decoded.split("||");

    const mapName = parts[0] ? decodeURIComponent(parts[0]) : undefined;
    const sharer = parts[1] ? decodeURIComponent(parts[1]) : undefined;
    const layerPart = parts[2] || "";
    const markerPart = parts[3] || "";

    // Layers
    const layers: Layer[] = layerPart
      .split(";")
      .map((layerStr) => {
        const [name, color, countriesStr] = layerStr.split(":");
        return {
          id: crypto.randomUUID(),
          name: name ? decodeURIComponent(name) : "",
          color: color ? decodeURIComponent(color) : "#3b82f6",
          countries: countriesStr
            ? countriesStr.split(",").filter(Boolean).map(decodeURIComponent)
            : [],
          visible: true,
        };
      })
      .filter((l) => l.name);

    // Markers
    let markers: Marker[] | undefined = undefined;

    if (markerPart) {
      markers = markerPart.split("|").flatMap((markerStr) => {
        const [name, isoCode, color, notes] = markerStr.split(",");
        const decodedIso = isoCode ? decodeURIComponent(isoCode) : "";

        // Skip invalid markers safely in a single pass
        if (!decodedIso) return [];

        return [
          {
            id: crypto.randomUUID(),
            name: name ? decodeURIComponent(name) : "",
            isoCode: decodedIso,
            color: color ? decodeURIComponent(color) : "#ef4444",
            notes: notes ? decodeURIComponent(notes) : undefined,
            visible: true,
          },
        ];
      });
    }

    const result: DecodedMapData = { layers };
    if (markers?.length) result.markers = markers;
    if (mapName) result.mapName = mapName;
    if (sharer) result.sharer = sharer;

    return result;
  } catch {
    return { layers: [] };
  }
}

/**
 * Generates a shareable URL for a map based on the provided base64 encoded map data.
 * @param code Base64 encoded map data
 * @returns Full URL to share the map
 */
export function getSharedMapUrl(code: string): string {
  return `${window.location.origin}/atlas?map=${code}`;
}
