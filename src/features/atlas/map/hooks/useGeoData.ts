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

  // Fetch geo data from static file first, then backend if missing
  const fetchGeoData = useCallback(async () => {
    setLoading(true);
    setGeoError(null);

    const staticGeoUrl = "/data/countries.geojson";
    const backendGeoUrl = import.meta.env.VITE_MAP_GEO_URL;
    const fetchOpts: RequestInit | undefined =
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" as RequestCache }
        : undefined;

    async function fetchWithFallback(staticUrl: string, backendUrl?: string) {
      try {
        const res = await fetch(staticUrl, fetchOpts);
        if (res.ok) return await res.json();
      } catch {
        // ignore static fetch error, try backend
      }
      if (backendUrl) {
        const res = await fetch(backendUrl, fetchOpts);
        if (res.ok) return await res.json();
        throw new Error("Failed to load map data from backend");
      }
      throw new Error("Failed to load map data");
    }

    try {
      const data = await fetchWithFallback(staticGeoUrl, backendGeoUrl);
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
