import { useState } from "react";
import { Card } from "@components";
import { LeaderboardTable } from "@features/quizzes";
import type {
  Difficulty,
  LeaderboardEntry,
  QuizType,
} from "@features/quizzes/types";
import { LeaderboardFilterBar } from "@features/quizzes/leaderboards/components/LeaderboardFilterBar";

interface BestScoresCardProps {
  scores: LeaderboardEntry[];
}

export function BestScoresCard({ scores }: BestScoresCardProps) {
  const [mode, setMode] = useState<QuizType>("flag");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  // Filter scores for the selected mode and difficulty, then sort by score descending and take top 3
  const filteredScores = scores
    .filter(
      (e: LeaderboardEntry & { type?: QuizType; difficulty?: Difficulty }) => {
        const entryMode = e.type;
        const entryDifficulty = e.difficulty;
        return entryMode === mode && entryDifficulty === difficulty;
      },
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <Card className="mt-6 w-full p-6 rounded-xl shadow-lg text-center font-sans">
      <h2 className="text-xl font-bold mb-2">Best Quiz Scores</h2>
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
