import { useEffect, useState } from "react";
import { leaderboardsService } from "../services/leaderboardsService";
import type { LeaderboardEntry, QuizType, Difficulty } from "../../types";

/**
 * Fetches leaderboard entries for a given user.
 * @param userId - The ID of the user to fetch scores for
 * @returns An array of leaderboard entries for the user
 */
export function useProfileLeaderboardScores(userId?: string) {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (!userId) return;
    const quizTypes: QuizType[] = ["flag", "capital"];
    const difficulties: Difficulty[] = ["easy", "medium", "hard", "expert"];
    Promise.all(
      quizTypes.flatMap((type) =>
        difficulties.map((difficulty) =>
          leaderboardsService.getLeaderboard(type, difficulty),
        ),
      ),
    ).then((results) => {
      const allEntries = results.flat();
      const userEntries = allEntries.filter((e) => e.playerId === userId);
      setScores(userEntries);
    });
  }, [userId]);

  return scores;
}
