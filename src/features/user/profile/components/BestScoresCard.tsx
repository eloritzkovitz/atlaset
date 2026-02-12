import { Card, TableDropdownFilter } from "@components";
import { LeaderboardTable } from "@features/quizzes";
import type {
  Difficulty,
  LeaderboardEntry,
  QuizType,
} from "@features/quizzes/types";
import { useState } from "react";

interface BestScoresCardProps {
  scores: LeaderboardEntry[];
}

export function BestScoresCard({ scores }: BestScoresCardProps) {
  const [mode, setMode] = useState<QuizType>("flag");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  // Filter scores for the selected mode and difficulty, then sort by score descending and take top 3
  const filteredScores = scores
    .sort((a, b) => b.score - a.score)
    .filter((e: any) => {
      const entryMode = e.quizType ?? e.type;
      const entryDifficulty = e.difficulty;
      return entryMode === mode && entryDifficulty === difficulty;
    })
    .slice(0, 3);

  return (
    <Card className="mt-6 w-full p-6 rounded-xl shadow-lg text-center font-sans">
      <h2 className="text-xl font-bold mb-2">Best Quiz Scores</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center items-center">
        <TableDropdownFilter
          placeholder="Type"
          value={mode}
          options={[
            { value: "flag", label: "Guess the Flag" },
            { value: "capital", label: "Guess the Capital" },
          ]}
          onChange={(v) => {
            const val = Array.isArray(v) ? v[0] : v;
            setMode(val as QuizType);
          }}
        />
        <TableDropdownFilter
          placeholder="Difficulty"
          value={difficulty}
          options={[
            { value: "easy", label: "Easy" },
            { value: "medium", label: "Medium" },
            { value: "hard", label: "Hard" },
            { value: "expert", label: "Expert" },
          ]}
          onChange={(v) => {
            const val = Array.isArray(v) ? v[0] : v;
            setDifficulty(val as Difficulty);
          }}
        />
      </div>
      <LeaderboardTable entries={filteredScores} maxEntries={3} />
    </Card>
  );
}
