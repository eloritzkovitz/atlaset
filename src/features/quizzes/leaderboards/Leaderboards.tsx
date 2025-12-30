import { useEffect, useState } from "react";
import { Card } from "@components";
import { leaderboardsService } from "./services/leaderboardsService";
import { Table, TableDropdownFilter } from "@components";
import type { QuizType, Difficulty, LeaderboardEntry } from "../types";

const TYPES: { value: QuizType; label: string }[] = [
  { value: "flag", label: "Flag" },
  { value: "capital", label: "Capital" },
];
const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "expert", label: "Expert" },
];

type LeaderboardRow = LeaderboardEntry & { rank: number };

export function Leaderboards() {
  const [type, setType] = useState<QuizType>("flag");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch leaderboard data when type or difficulty changes
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

  // Add rank property for display
  const rankedData: LeaderboardRow[] = data.map((row, i) => ({
    ...row,
    rank: i + 1,
  }));

  // Don't render until data is loaded
  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="mb-12 text-3xl font-bold text-blue-800 text-center dark:text-text">
        Leaderboards
      </h1>
      <Card className="max-w-2xl w-full p-8 rounded-xl shadow-lg text-center font-sans">
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center items-center">
          <TableDropdownFilter
            placeholder="Type"
            value={type}
            options={TYPES}
            onChange={(v) => setType(Array.isArray(v) ? v[0] : (v as QuizType))}
          />
          <TableDropdownFilter
            placeholder="Difficulty"
            value={difficulty}
            options={DIFFICULTIES}
            onChange={(v) =>
              setDifficulty(Array.isArray(v) ? v[0] : (v as Difficulty))
            }
          />
        </div>
        <div className="overflow-x-auto">
          <Table
            columns={[
              { key: "rank", label: "#" },
              { key: "playerName", label: "Player" },
              { key: "score", label: "Score" },
              { key: "time", label: "Time", render: (row) => row.time ?? "-" },
              {
                key: "date",
                label: "Date",
                render: (row) => new Date(row.date).toLocaleString(),
              },
            ]}
            data={rankedData}
          />
        </div>
      </Card>
    </div>
  );
}
