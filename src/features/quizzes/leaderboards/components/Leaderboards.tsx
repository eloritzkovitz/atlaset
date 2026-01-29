import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaFlag,
  FaQuestion,
  FaLeaf,
  FaCompass,
  FaBinoculars,
  FaHatWizard,
  FaLandmark,
} from "react-icons/fa6";
import { Card, TableDropdownFilter } from "@components";
import type { DropdownOption } from "@types";
import { leaderboardsService } from "../services/leaderboardsService";
import type {
  QuizType,
  Difficulty,
  LeaderboardEntry,
  LeaderboardRow,
} from "../../types";
import { LeaderboardRowComponent } from "./LeaderboardRow";
import { useAuth } from "@contexts/AuthContext";
import { useUserProfile } from "@features/user";

type NonNullDifficulty = Exclude<Difficulty, null>;

const TYPE_OPTIONS: Array<
  DropdownOption<QuizType> & {
    icon?: React.ComponentType<{ className?: string }>;
  }
> = [
  {
    value: "flag",
    label: "Guess the Flag",
    icon: FaFlag,
  },
  {
    value: "capital",
    label: "Guess the Capital",
    icon: FaLandmark,
  },
];

const DIFFICULTY_OPTIONS: Array<
  DropdownOption<NonNullDifficulty> & {
    icon?: React.ComponentType<{ className?: string }>;
  }
> = [
  { value: "easy", label: "Easy", icon: FaLeaf },
  { value: "medium", label: "Medium", icon: FaCompass },
  { value: "hard", label: "Hard", icon: FaBinoculars },
  { value: "expert", label: "Expert", icon: FaHatWizard },
];

export function Leaderboards() {
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

  const { user: currentUser } = useAuth();
  const { profile: currentProfile } = useUserProfile({ uid: currentUser?.uid });

  // Add rank property for display
  const rankedData: LeaderboardRow[] = data.map((row, i) => {
    let photoURL = row.photoURL;
    let username = row.username;
    if (row.playerId === currentUser?.uid) {
      photoURL = currentProfile?.photoURL ?? currentUser?.photoURL ?? undefined;
      username = currentProfile?.username ?? row.username;
    }
    return {
      ...row,
      rank: i + 1,
      photoURL,
      username,
    };
  });

  // Generic option renderer for dropdowns
  function renderOption(opt: {
    label: React.ReactNode;
    icon?: React.ComponentType<{ size?: number }>;
  }): React.ReactNode {
    const Icon = opt.icon;
    return (
      <span>
        {Icon ? (
          <span className="inline mr-2">
            <Icon size={18} />
          </span>
        ) : (
          <span className="inline mr-2">
            <FaQuestion size={18} />
          </span>
        )}
        {String(opt.label)}
      </span>
    );
  }

  // Handle loading state
  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 mb-12 mt-14">
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
                <LeaderboardRowComponent
                  key={row.playerName + row.rank}
                  row={row}
                  index={i}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
