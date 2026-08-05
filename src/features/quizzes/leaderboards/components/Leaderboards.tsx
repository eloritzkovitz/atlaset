import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Container, PageHeader } from "@components";
import { LeaderboardTable } from "./LeaderboardTable";
import { LeaderboardFilterBar } from "./LeaderboardFilterBar";
import { useLeaderboardData } from "../hooks/useLeaderboardData";
import type { QuizType, Difficulty } from "../../types";

export function Leaderboards() {
  const { t } = useTranslation("quizzes");

  const [type, setType] = useState<QuizType>("flag");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  // Fetch and sort leaderboard data based on selected type and difficulty
  const { data: sortedData, loading } = useLeaderboardData(type, difficulty);

  // Handle loading state
  if (loading) return null;

  return (
    <Container className="flex flex-col items-center mt-12">
      <div className="w-full">
        <PageHeader title={t("leaderboards.title")} fallbackPath="/quizzes" />
        <Card className="w-full p-8 rounded-xl shadow-lg text-center font-sans">
          <LeaderboardFilterBar
            mode={type}
            setMode={setType}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
          <LeaderboardTable entries={sortedData} />
        </Card>
      </div>
    </Container>
  );
}
