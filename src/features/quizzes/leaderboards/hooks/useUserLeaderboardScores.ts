import { useEffect, useState } from "react";
import { leaderboardsService } from "../services/leaderboardsService";
import type { LeaderboardEntry } from "../../types";

/**
 * Fetches leaderboard entries for a given user.
 * @param userId - The ID of the user to fetch scores for
 * @returns An array of leaderboard entries for the user
 */
export function useUserLeaderboardScores(userId?: string) {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);

  // Fetch user leaderboard scores when the userId changes
  useEffect(() => {
    if (!userId) {
      setScores([]);
      return;
    }

    let isCancelled = false;

    async function fetchUserScores() {
      try {
        const results = await leaderboardsService.getUserScores(userId ?? "");
        if (!isCancelled) {
          setScores(results);
        }
      } catch (error) {
        console.error("Failed to fetch user leaderboard scores:", error);
      }
    }

    fetchUserScores();

    return () => {
      isCancelled = true;
    };
  }, [userId]);

  return scores;
}
