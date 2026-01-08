/**
 * Utilities to encode and decode map data for sharing via URL parameters.
 */

/**
 * Encode map data (layers and optional markers) as a base64 string.
 * Layers: { name, color, countries[] }, Markers: { lat, lng, label? } *
 * Format: layers|markers (both as compact strings)
 * @param mapData Object with layers and optional markers
 * @returns Base64 encoded string
 */
export function encodeMapData(mapData: {
  layers: { name: string; color: string; countries: string[] }[];
  markers?: { lat: number; lng: number; label?: string }[];
  mapName?: string;
  sharer?: string;
}): string {
  // Serialize layers (encode all fields)
  const layerStrings = mapData.layers
    .map((l) =>
      [
        encodeURIComponent(l.name),
        encodeURIComponent(l.color),
        l.countries.map(encodeURIComponent).join(",")
      ].join(":")
    )
    .join(";");

  // Serialize markers
  let markerString = "";
  if (Array.isArray(mapData.markers)) {
    markerString = mapData.markers
      .map((m) =>
        [m.lat, m.lng, m.label ? encodeURIComponent(m.label) : ""].join(",")
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
export function decodeMapData(code: string): {
  layers: { name: string; color: string; countries: string[] }[];
  markers?: { lat: number; lng: number; label?: string }[];
  mapName?: string;
  sharer?: string;
} {
  try {
    const decoded = atob(code);
    const parts = decoded.split("||");

    // Extract data parts
    const mapName = parts[0] ? decodeURIComponent(parts[0]) : undefined;
    const sharer = parts[1] ? decodeURIComponent(parts[1]) : undefined;
    const layerPart = parts[2] || "";
    const markerPart = parts[3] || "";

    // Layers
    const layers = layerPart
      .split(";")
      .map((layerStr) => {
        const [name, color, countriesStr] = layerStr.split(":");
        return {
          name: name ? decodeURIComponent(name) : "",
          color: color ? decodeURIComponent(color) : "",
          countries: countriesStr
            ? countriesStr.split(",").filter(Boolean).map(decodeURIComponent)
            : [],
        };
      })
      .filter((l) => l.name);

    // Markers
    let markers: { lat: number; lng: number; label?: string }[] | undefined =
      undefined;
    if (markerPart && markerPart.length > 0) {
      markers = markerPart.split("|").map((markerStr) => {
        const [lat, lng, label] = markerStr.split(",");
        return {
          lat: Number(lat),
          lng: Number(lng),
          ...(label ? { label: decodeURIComponent(label) } : {}),
        };
      });
    }
    const result: {
      layers: { name: string; color: string; countries: string[] }[];
      markers?: { lat: number; lng: number; label?: string }[];
      mapName?: string;
      sharer?: string;
    } = { layers };
    if (markers) result.markers = markers;
    if (mapName) result.mapName = mapName;
    if (sharer) result.sharer = sharer;
    return result;
  } catch {
    return { layers: [] };
  }
}
