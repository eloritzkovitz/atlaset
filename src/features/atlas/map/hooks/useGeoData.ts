import { useCallback, useEffect, useState } from "react";
import type { GeoData } from "../types";

/**
 * Manages fetching and state of geographical data for maps.
 * @returns Object containing geoData, geoError, and loading state.
 */
export function useGeoData() {
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch geo data from static file in dev, backend in prod
  const fetchGeoData = useCallback(async () => {
    setLoading(true);
    setGeoError(null);

    const geoDataUrl =
      import.meta.env.VITE_MAP_GEO_URL || "/data/countries.geojson";

    try {
      const res = await fetch(
        geoDataUrl,
        process.env.NODE_ENV === "development"
          ? { cache: "no-store" as RequestCache }
          : undefined
      );
      if (!res.ok) throw new Error("Failed to load map data");
      const data = await res.json();
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
