import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@components";
import { LeaderboardFilterBar } from "@features/quizzes/leaderboards/components/LeaderboardFilterBar";
import { LeaderboardTable } from "@features/quizzes/leaderboards/components/LeaderboardTable";
import type {
  Difficulty,
  LeaderboardEntry,
  QuizType,
} from "@features/quizzes/types";

interface BestScoresCardProps {
  scores: LeaderboardEntry[];
}

export function BestScoresCard({ scores }: BestScoresCardProps) {
  const { t } = useTranslation("user");

  const [mode, setMode] = useState<QuizType>("flag");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  // Filter scores for the selected mode and difficulty, then sort by score descending and take top 3
  const filteredScores = scores
    .filter((e) => e.type === mode && e.difficulty === difficulty)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => ({
      ...entry,
      playerName: entry.playerName || "Player",
      username: entry.username,
      photoURL: entry.photoURL ?? undefined,
    }));

  return (
    <Card className="mt-6 w-full p-6 rounded-xl shadow-lg font-sans">
      <h2 className="text-xl font-bold mb-2">{t("profile.bestScores")}</h2>
      <LeaderboardFilterBar
        mode={mode}
        setMode={setMode}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
      <LeaderboardTable entries={filteredScores} maxEntries={3} />
    </Card>
  );
}
