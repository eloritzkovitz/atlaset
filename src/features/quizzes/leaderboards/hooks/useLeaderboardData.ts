import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { leaderboardsService } from "../services/leaderboardsService";
import { profileService } from "@features/user/profile/services/profileService";
import type { QuizType, Difficulty, LeaderboardEntry } from "../../types";

/**
 * Fetches leaderboard data for a given type and difficulty.
 * @param type - The quiz type.
 * @param difficulty - The quiz difficulty.
 * @returns An object containing the sorted leaderboard entries and loading state.
 */
export function useLeaderboardData(type: QuizType, difficulty: Difficulty) {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation("quizzes");

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    async function fetchAndAnonymize() {
      const rawEntries = await leaderboardsService.getLeaderboard(
        type,
        difficulty,
      );
      const topEntries = rawEntries.slice(0, 25);

      // Extract unique player IDs
      const playerIds = Array.from(
        new Set(topEntries.map((e) => e.playerId).filter(Boolean)),
      );

      // Fetch profiles for all unique player IDs
      const profiles = await Promise.all(
        playerIds.map(async (id) => {
          const profile = await profileService.getProfile(id);
          return { id, profile };
        }),
      );

      const profileMap = new Map(profiles.map((p) => [p.id, p.profile]));

      const processedEntries = topEntries.map((entry) => {
        const userProfile = profileMap.get(entry.playerId);

        // Check for privacy setting (supports both naming variants)
        const isSearchIndexingAllowed =
          userProfile?.isSearchIndexingAllowed ?? true;

        if (!isSearchIndexingAllowed || !userProfile) {
          return {
            ...entry,
            playerName: t("leaderboards.table.anonymousPlayer"),
            username: undefined,
            photoURL: undefined,
            playerId: "",
          };
        }

        return {
          ...entry,
          playerName: userProfile.displayName || entry.playerName,
          username: userProfile.username || entry.username,
          photoURL: userProfile.photoURL || entry.photoURL,
        };
      });

      if (mounted) {
        setData(processedEntries.sort((a, b) => b.score - a.score));
        setLoading(false);
      }
    }

    // Fetch and process leaderboard data
    fetchAndAnonymize().catch(() => {
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [type, difficulty, t]);

  return { data, loading };
}
