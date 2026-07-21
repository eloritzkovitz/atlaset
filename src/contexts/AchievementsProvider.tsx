import { useState, useEffect, useCallback } from "react";
import type { Achievement } from "@features/dashboard/achievements/types";
import { fetchWithFallback } from "@lib/api-client";
import { AchievementsContext } from "./AchievementsContext";

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
    try {
      const data = await fetchWithFallback(
        staticAchievementsUrl,
        { envVar: "VITE_ACHIEVEMENTS_DATA_URL" },
        "achievements data",
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
