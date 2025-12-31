import { useEffect, useState, type JSX } from "react";
import {
  FaChevronLeft,
  FaFlag,
  FaMedal,
  FaQuestion,
  FaLeaf,
  FaCompass,
  FaBinoculars,
  FaHatWizard,
  FaLandmark,
} from "react-icons/fa6";
import { Card, TableDropdownFilter } from "@components";
import type { DropdownOption } from "@types";
import { formatTimeSeconds } from "@utils/date";
import { leaderboardsService } from "./services/leaderboardsService";
import type {
  QuizType,
  Difficulty,
  LeaderboardEntry,
  LeaderboardRow,
} from "../types";

type NonNullDifficulty = Exclude<Difficulty, null>;

const TYPE_OPTIONS: Array<DropdownOption<QuizType> & { icon: JSX.Element }> = [
  {
    value: "flag",
    label: "Guess the Flag",
    icon: <FaFlag className="inline mr-2" />,
  },
  {
    value: "capital",
    label: "Guess the Capital",
    icon: <FaLandmark className="inline mr-2" />,
  },
];

const DIFFICULTY_OPTIONS: Array<
  DropdownOption<NonNullDifficulty> & { icon: JSX.Element }
> = [
  { value: "easy", label: "Easy", icon: <FaLeaf className="inline mr-2" /> },
  {
    value: "medium",
    label: "Medium",
    icon: <FaCompass className="inline mr-2" />,
  },
  {
    value: "hard",
    label: "Hard",
    icon: <FaBinoculars className="inline mr-2" />,
  },
  {
    value: "expert",
    label: "Expert",
    icon: <FaHatWizard className="inline mr-2" />,
  },
];

export function Leaderboards() {
  // Generic option renderer for dropdowns
  function renderOption(opt: {
    label: React.ReactNode;
    icon?: JSX.Element;
  }): React.ReactNode {
    return (
      <span>
        {opt.icon ?? <FaQuestion className="inline mr-2" />}
        {String(opt.label)}
      </span>
    );
  }
  const [type, setType] = useState<QuizType>("flag");
  const [difficulty, setDifficulty] = useState<NonNullDifficulty>("easy");
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

  // Handle loading state
  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 mb-12">
        <a
          href="/quizzes"
          className="text-text transition-colors flex items-center"
        >
          <FaChevronLeft className="inline-block mr-2 text-xl" />
        </a>
        <h1 className="text-3xl font-bold text-text m-0">Leaderboards</h1>
      </div>
      <Card className="max-w-4xl w-full p-8 rounded-xl shadow-lg text-center font-sans">
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center items-center">
          <TableDropdownFilter
            placeholder="Type"
            value={type}
            options={TYPE_OPTIONS}
            onChange={(v) => setType(Array.isArray(v) ? v[0] : (v as QuizType))}
            renderOption={renderOption}
          />
          <TableDropdownFilter
            placeholder="Difficulty"
            value={difficulty}
            options={DIFFICULTY_OPTIONS}
            onChange={(v) =>
              setDifficulty(Array.isArray(v) ? v[0] : (v as NonNullDifficulty))
            }
            renderOption={renderOption}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-base-200">
                <th className="px-4 py-2 text-left text-lg font-semibold">#</th>
                <th className="px-4 py-2 text-left text-lg font-semibold">
                  Player
                </th>
                <th className="px-4 py-2 text-right text-lg font-semibold">
                  Score
                </th>
                <th className="px-4 py-2 text-right text-lg font-semibold">
                  Max Streak
                </th>
                <th className="px-4 py-2 text-right text-lg font-semibold">
                  Time
                </th>
                <th className="px-4 py-2 text-right text-lg font-semibold">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {rankedData.map((row, i) => (
                <tr
                  key={row.playerName + row.rank}
                  className={`hover:bg-base-200 transition ${
                    i % 2 === 0 ? "bg-base-100" : "bg-base-300"
                  }`}
                >
                  <td className="px-4 py-2 font-bold">
                    {i === 0 ? (
                      <FaMedal
                        className="text-yellow-400 drop-shadow-sm"
                        title="1st Place"
                      />
                    ) : i === 1 ? (
                      <FaMedal
                        className="text-gray-400 drop-shadow-sm"
                        title="2nd Place"
                      />
                    ) : i === 2 ? (
                      <FaMedal
                        className="text-orange-500 drop-shadow-sm"
                        title="3rd Place"
                      />
                    ) : (
                      row.rank
                    )}
                  </td>
                  <td className="px-4 py-2">{row.playerName}</td>
                  <td className="px-4 py-2 text-right">{row.score}</td>
                  <td className="px-4 py-2 text-right">
                    {row.maxStreak ?? "-"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatTimeSeconds(row.time)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {new Date(row.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
