import { useCallback, useEffect, useState } from "react";
import { fetchWithFallback } from "@lib/api-client";
import type { GeoData } from "../types";

/**
 * Manages fetching and state of geographical data for maps.
 * @returns Object containing geoData, geoError, and loading state.
 */
export function useGeoData() {
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch geo data from static file first, then backend if missing
  const fetchGeoData = useCallback(async () => {
    setLoading(true);
    setGeoError(null);

    const staticGeoUrl = "/data/countries.geojson";
    try {
      const data = await fetchWithFallback(
        staticGeoUrl,
        { envVar: "VITE_MAP_GEO_URL" },
        "map data",
      );
      setGeoData(data);
      setLoading(false);
    } catch (err) {
      if (err instanceof Error) {
        setGeoError(err.message);
      } else {
        setGeoError("Failed to load map data");
      }
      setLoading(false);
    }
  }, []);

  // Fetch geo data on mount
  useEffect(() => {
    fetchGeoData();
  }, [fetchGeoData]);

  return { geoData, geoError, loading };
}
