/**
 * Utilities to encode and decode map data for sharing via URL parameters.
 */

/**
 * Encode map data as a base64 string.
 * @param mapData Object with layers and optional markers, mapName, and sharer
 * @returns Base64 encoded string
 */
export function encodeMapData(mapData: {
  layers: { name: string; color: string; countries: string[] }[];
  markers?: Array<{
    name?: string;
    coordinates: [number, number];
    color?: string;
    description?: string;
  }>;
  mapName?: string;
  sharer?: string;
}): string {
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
          Array.isArray(m.coordinates) ? m.coordinates[0] : "",
          Array.isArray(m.coordinates) ? m.coordinates[1] : "",
          encodeURIComponent(m.color ?? ""),
          encodeURIComponent(m.description ?? ""),
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
export function decodeMapData(code: string): {
  layers: { name: string; color: string; countries: string[] }[];
  markers?: Array<{
    name?: string;
    coordinates: [number, number];
    color?: string;
    description?: string;
  }>;
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
    let markers:
      | Array<{
          name?: string;
          coordinates: [number, number];
          color?: string;
          description?: string;
        }>
      | undefined = undefined;
    if (markerPart && markerPart.length > 0) {
      markers = markerPart.split("|").map((markerStr) => {
        const [name, lng, lat, color, description] = markerStr.split(",");
        return {
          name: decodeURIComponent(name) || undefined,
          coordinates: [Number(lng), Number(lat)] as [number, number],
          color: color ? decodeURIComponent(color) : undefined,
          description: description
            ? decodeURIComponent(description)
            : undefined,
        };
      });
    }

    // Construct result
    const result: {
      layers: { name: string; color: string; countries: string[] }[];
      markers?: Array<{
        name?: string;
        coordinates: [number, number];
        color?: string;
        description?: string;
      }>;
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

/**
 * Generates a shareable URL for a map based on the provided base64 encoded map data.
 * @param code Base64 encoded map data
 * @returns Full URL to share the map
 */
export function getSharedMapUrl(code: string): string {
  return `${window.location.origin}/atlas?map=${code}`;
}
