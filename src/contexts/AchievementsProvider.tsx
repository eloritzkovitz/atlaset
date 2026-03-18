import { useState, useEffect, useCallback } from "react";
import { AchievementsContext } from "./AchievementsContext";
import type { Achievement } from "@features/dashboard/achievements/types";

export function AchievementsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [achievements, setAchievements] = useState<Achievement[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch achievements data from static file first, then backend if missing
  const fetchAchievements = useCallback(async () => {
    setLoading(true);
    setError(null);
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
      setAchievements(data);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load achievements data",
      );
      setLoading(false);
    }
  }, []);

  // Fetch achievements data on mount
  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return (
    <AchievementsContext.Provider value={{ achievements, loading, error }}>
      {children}
    </AchievementsContext.Provider>
  );
}
