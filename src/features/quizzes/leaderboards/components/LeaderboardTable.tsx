import React from "react";
import { LeaderboardRowComponent } from "./LeaderboardRow";
import type { LeaderboardEntry, QuizType, Difficulty } from "../../types";

const TABLE_HEADERS = [
  { label: "#", align: "left" },
  { label: "Player", align: "left" },
  { label: "Score", align: "right" },
  { label: "Max Streak", align: "right" },
  { label: "Time", align: "right" },
  { label: "Date", align: "right" },
];

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
            {TABLE_HEADERS.map((header) => (
              <th
                key={header.label}
                className={`px-4 py-2 text-${header.align} text-lg font-semibold`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rankedData.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted py-4">
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
