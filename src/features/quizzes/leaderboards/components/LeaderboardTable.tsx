import React from "react";
import { LeaderboardRowComponent } from "./LeaderboardRow";
import type { LeaderboardEntry, QuizType, Difficulty } from "../../types";
import { useTranslation } from "react-i18next";

const TABLE_HEADER_KEYS = [
  { key: "leaderboards.table.headers.rank", align: "left" },
  { key: "leaderboards.table.headers.player", align: "left" },
  { key: "leaderboards.table.headers.score", align: "right" },
  { key: "leaderboards.table.headers.maxStreak", align: "right" },
  { key: "leaderboards.table.headers.time", align: "right" },
  { key: "leaderboards.table.headers.date", align: "right" },
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
  const { t, i18n } = useTranslation("quizzes");
  const isRtl = i18n.dir() === "rtl";
  const rankedData = (entries ?? []).map((row, i) => ({
    ...row,
    rank: i + 1,
  }));

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">
        {t("lobby.cards.leaderboards.title")}
      </h2>
      <table className="min-w-full table-auto border-separate border-spacing-y-2">
        <thead>
          <tr className="bg-base-200">
            {TABLE_HEADER_KEYS.map((header) => {
              const align = isRtl
                ? header.align === "left"
                  ? "right"
                  : "left"
                : header.align;
              return (
                <th
                  key={header.key}
                  className={`px-4 py-2 text-${align} text-lg font-semibold`}
                >
                  {t(header.key)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rankedData.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted py-4">
                {t("leaderboards.table.noScores")}
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
