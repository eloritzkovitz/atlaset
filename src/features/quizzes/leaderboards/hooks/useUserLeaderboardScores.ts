import { useEffect, useState } from "react";
import {
  TYPE_OPTIONS,
  DIFFICULTY_OPTIONS,
} from "../constants/leaderboardOptions";
import { leaderboardsService } from "../services/leaderboardsService";
import type { LeaderboardEntry, QuizType, Difficulty } from "../../types";

/**
 * Fetches leaderboard entries for a given user.
 * @param userId - The ID of the user to fetch scores for
 * @returns An array of leaderboard entries for the user
 */
export function useUserLeaderboardScores(userId?: string) {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const results = await Promise.all(
        (TYPE_OPTIONS as { value: QuizType }[])
          .map((typeOpt) =>
            (DIFFICULTY_OPTIONS as { value: Difficulty }[]).map((diffOpt) =>
              leaderboardsService.getLeaderboard(typeOpt.value, diffOpt.value),
            ),
          )
          .flat(),
      );
      const allEntries = results.flat();
      setScores(allEntries.filter((e) => e.playerId === userId));
    })();
  }, [userId]);

  return scores;
}
