import { useCallback, useEffect, useState } from "react";
import { DEFAULT_MAP_SETTINGS } from "@constants";
import { appDb } from "@utils/db";
import { CACHE_TTL } from "../../../../shared/config/cache";

/**
 * Manages fetching and state of geographical data for maps.
 * @returns Object containing geoData, geoError, and loading state.
 */
export function useGeoData() {
  const [geoData, setGeoData] = useState<any | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch geo data with caching
  const fetchGeoData = useCallback(async () => {
    setLoading(true);
    setGeoError(null);

    const now = Date.now();
    const cached = await appDb.geoData?.get("geoData");

    // Use cached data if valid
    if (cached && cached.ts && now - cached.ts < CACHE_TTL) {
      setGeoData(cached.data);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(DEFAULT_MAP_SETTINGS.geoUrl);
      if (!res.ok) throw new Error("Failed to load map data");
      const data = await res.json();
      setGeoData(data);
      setLoading(false);
      // Save to Dexie
      await appDb.geoData?.put({ id: "geoData", data, ts: Date.now() });
    } catch (err: any) {
      setGeoError(err.message || "Failed to load map data");
      setLoading(false);
    }
  }, []);

  // Fetch geo data on mount
  useEffect(() => {
    fetchGeoData();
  }, [fetchGeoData]);

  return { geoData, geoError, loading };
}
