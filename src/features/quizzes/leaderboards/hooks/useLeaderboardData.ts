import { useEffect, useState } from "react";
import { leaderboardsService } from "../services/leaderboardsService";
import type { QuizType, Difficulty, LeaderboardEntry } from "../../types";

/**
 * Fetches leaderboard data for a given type and difficulty.
 * @param type - The quiz type (e.g., "flag", "capital").
 * @param difficulty - The quiz difficulty (e.g., "easy", "medium", "hard").
 * @returns An object containing the sorted leaderboard entries and loading state.
 */
export function useLeaderboardData(type: QuizType, difficulty: Difficulty) {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch leaderboard data whenever type or difficulty changes
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    leaderboardsService
      .getLeaderboard(type, difficulty)
      .then((entries) => {
        if (mounted) setData(entries);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [type, difficulty]);

  // Sort leaderboard data by score descending
  const sortedData = [...data].sort((a, b) => b.score - a.score);

  return { data: sortedData, loading };
}
