import { useState } from "react";
import { Card, DirectionalIcon } from "@components";
import { useTranslation } from "react-i18next";
import { LeaderboardTable } from "./LeaderboardTable";
import { LeaderboardFilterBar } from "./LeaderboardFilterBar";
import { useLeaderboardData } from "../hooks/useLeaderboardData";
import type { QuizType, Difficulty } from "../../types";

export function Leaderboards() {
  const [type, setType] = useState<QuizType>("flag");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const { t } = useTranslation("quizzes");

  // Fetch and sort leaderboard data based on selected type and difficulty
  const { data: sortedData, loading } = useLeaderboardData(type, difficulty);

  // Handle loading state
  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 mb-12 mt-14">
        <a
          href="/quizzes"
          className="text-text transition-colors flex items-center"
        >
          <DirectionalIcon
            variant="chevron"
            direction="prev"
            className="inline-block me-2 text-xl"
          />
        </a>
        <h1 className="text-3xl font-bold text-text m-0">
          {t("lobby.cards.leaderboards.title")}
        </h1>
      </div>
      <Card className="max-w-4xl w-full p-8 rounded-xl shadow-lg text-center font-sans">
        <LeaderboardFilterBar
          mode={type}
          setMode={setType}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />
        <LeaderboardTable entries={sortedData} />
      </Card>
    </div>
  );
}
