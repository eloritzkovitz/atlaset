import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Table, type TableColumn, RankBadge } from "@components";
import { UserInfo } from "@features/user/profile/components/UserInfo";
import type { UserProfile } from "@features/user/profile/types";
import { formatDate, formatTimeSeconds } from "@utils";
import type {
  LeaderboardEntry,
  LeaderboardRow,
  QuizType,
  Difficulty,
} from "../../types";

interface LeaderboardTableProps {
  entries?: LeaderboardEntry[];
  initialType?: QuizType;
  initialDifficulty?: Difficulty;
  maxEntries?: number;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  maxEntries,
}) => {
  const { t } = useTranslation(["quizzes", "common"]);

  const rankedData: LeaderboardRow[] = useMemo(() => {
    const list = entries ?? [];
    const sliced = maxEntries ? list.slice(0, maxEntries) : list;
    return sliced.map((row, i) => ({
      ...row,
      rank: i + 1,
    }));
  }, [entries, maxEntries]);

  const columns: TableColumn<LeaderboardRow>[] = useMemo(
    () => [
      {
        key: "rank",
        label: "#",
        className: "text-center w-12",
        sortable: false,
        render: (row) => <RankBadge rank={row.rank} />,
      },
      {
        key: "playerName",
        label: t("leaderboards.table.headers.player"),
        className: "text-start w-full",
        sortable: true,
        sortValue: (row) => row.playerName.toLowerCase(),
        render: (row) => {
          const isAnonymous = !row.playerId;
          const playerProfile: UserProfile = {
            uid: row.playerId,
            displayName: row.playerName,
            username: row.username || "unknown",
            photoURL: row.photoURL,
            isPublic: !isAnonymous,
            visitedCountryCodes: [],
            wantToVisitCountryCodes: [],
          };

          return (
            <UserInfo
              user={playerProfile}
              showDisplayName
              showUsername={false}
            />
          );
        },
      },
      {
        key: "score",
        label: t("leaderboards.table.headers.score"),
        className: "text-end font-semibold whitespace-nowrap px-4",
        sortable: true,
        render: (row) => row.score,
      },
      {
        key: "maxStreak",
        label: t("leaderboards.table.headers.maxStreak"),
        className: "text-end whitespace-nowrap px-4",
        sortable: true,
        sortValue: (row) => row.maxStreak ?? 0,
        render: (row) => row.maxStreak ?? "-",
      },
      {
        key: "time",
        label: t("leaderboards.table.headers.time"),
        className: "text-end whitespace-nowrap px-4",
        sortable: true,
        render: (row) => formatTimeSeconds(row.time),
      },
      {
        key: "date",
        label: t("leaderboards.table.headers.date"),
        className: "text-end whitespace-nowrap px-4",
        sortable: true,
        sortValue: (row) => new Date(row.date).getTime(),
        render: (row) => formatDate(row.date, "long"),
      },
    ],
    [t],
  );

  return (
    <div className="w-full">
      <Table<LeaderboardRow> columns={columns} data={rankedData} striped />
    </div>
  );
};
