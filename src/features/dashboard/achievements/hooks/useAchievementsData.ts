import { useCallback, useEffect, useState } from "react";
import type { Achievement } from "../../../dashboard/types";

/**
 * Manages fetching and state of achievements data.
 * @returns Object containing achievementsData, achievementsError, and loading state.
 */
export function useAchievementsData() {
  const [achievementsData, setAchievementsData] = useState<
    Achievement[] | null
  >(null);
  const [achievementsError, setAchievementsError] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  // Fetch achievements data from static file first, then backend if missing
  const fetchAchievementsData = useCallback(async () => {
    setLoading(true);
    setAchievementsError(null);

    const staticAchievementsUrl = "/data/achievements.json";
    const backendAchievementsUrl = import.meta.env.VITE_ACHIEVEMENTS_DATA_URL;
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
        throw new Error("Failed to load achievements data from backend");
      }
      throw new Error("Failed to load achievements data");
    }

    try {
      const data = await fetchWithFallback(
        staticAchievementsUrl,
        backendAchievementsUrl,
      );
      setAchievementsData(data);
      setLoading(false);
    } catch (err) {
      if (err instanceof Error) {
        setAchievementsError(err.message);
      } else {
        setAchievementsError("Failed to load achievements data");
      }
      setLoading(false);
    }
  }, []);

  // Fetch achievements data on mount
  useEffect(() => {
    fetchAchievementsData();
  }, [fetchAchievementsData]);

  return { achievementsData, achievementsError, loading };
}
