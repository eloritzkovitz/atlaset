/**
 * Utilities to encode and decode map layers for sharing via URL parameters.
 */

/**
 * Encode map layers as a base64 string. Each layer is an object: { id: string, countries: string[] }
 * The format is: layer1id:US,FR,DE;layer2id:IT,ES
 * @param layers Array of layers, each with id and countries
 * @returns Base64 encoded string
 */
export function encodeMapLayers(
  layers: { id: string; color: string; countries: string[] }[]
): string {
  // Example: "visited:#00bfff:US,FR,DE;wishlist:#ff0000:IT,ES"
  const layerStrings = layers.map(
    (l) => `${l.id}:${l.color}:${l.countries.join(",")}`
  );
  return btoa(layerStrings.join(";"));
}

/**
 * Decode a base64 string into an array of layers: { id, countries }
 * @param code Base64 encoded string
 * @returns Array of layers, each with id and countries
 */
export function decodeMapLayers(
  code: string
): { id: string; color: string; countries: string[] }[] {
  try {
    const decoded = atob(code);
    // Split by ; for layers, then by : for id/color/countries
    return decoded
      .split(";")
      .map((layerStr) => {
        const [id, color, countriesStr] = layerStr.split(":");
        return {
          id,
          color: color || "",
          countries: countriesStr
            ? countriesStr.split(",").filter(Boolean)
            : [],
        };
      })
      .filter((l) => l.id);
  } catch {
    return [];
  }
}
