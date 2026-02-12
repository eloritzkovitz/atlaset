import React from "react";
import { LeaderboardRowComponent } from "./LeaderboardRow";
import type { LeaderboardEntry, QuizType, Difficulty } from "../../types";

interface LeaderboardTableProps {
  entries?: LeaderboardEntry[];
  initialType?: QuizType;
  initialDifficulty?: Difficulty;
  maxEntries?: number;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
}) => {
  const rankedData = (entries ?? []).map((row, i) => ({
    ...row,
    rank: i + 1,
  }));

  return (
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
            <th className="px-4 py-2 text-right text-lg font-semibold">Time</th>
            <th className="px-4 py-2 text-right text-lg font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          {rankedData.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-4">
                No scores found.
              </td>
            </tr>
          ) : (
            rankedData.map((row, i) => (
              <LeaderboardRowComponent
                key={row.playerName + row.rank}
                row={row}
                index={i}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
