import { useMemo } from "react";
import { decodeMapData } from "@features/atlas/export/utils/mapShare";

/**
 * Returns shared map information such as map name and sharer from the URL.
 * @returns 
 */
export function useSharedMapInfo() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const mapParam = params.get("map");

    // If no map parameter, return empty object
    if (!mapParam) return {};
    
    const { mapName, sharer } = decodeMapData(mapParam);
    return { mapName, sharer };
  }, []);
}
