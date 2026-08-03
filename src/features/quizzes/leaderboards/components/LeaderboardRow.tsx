import { useMemo } from "react";
import { RankBadge } from "@components";
import { UserInfo } from "@features/user/profile/components/UserInfo";
import { formatDate, formatTimeSeconds } from "@utils";
import type { UserProfile } from "@features/user/profile/types";
import type { LeaderboardRow } from "../../types";

interface LeaderboardRowComponentProps {
  row: LeaderboardRow;
  index: number;
}

export function LeaderboardRowComponent({
  row,
  index,
}: LeaderboardRowComponentProps) {
  const playerProfile: UserProfile = useMemo(
    () => ({
      uid: row.playerId,
      displayName: row.playerName,
      username: row.username || "unknown",
      photoURL: row.photoURL,
      isPublic: true,
      visitedCountryCodes: [],
      wantToVisitCountryCodes: [],
    }),
    [row.playerId, row.playerName, row.username, row.photoURL],
  );

  return (
    <tr
      key={`${row.playerId}-${row.rank}`}
      className={`hover:bg-base-200 transition ${
        index % 2 === 0 ? "bg-base-100" : "bg-base-300"
      }`}
    >
      <td className="px-4 py-2 font-bold">
        <RankBadge rank={row.rank} />
      </td>
      <td className="px-4 py-2">
        <UserInfo
          user={playerProfile}
          showDisplayName
          showUsername={!!row.username}
        />
      </td>
      <td className="px-4 py-2 text-right">{row.score}</td>
      <td className="px-4 py-2 text-right">{row.maxStreak ?? "-"}</td>
      <td className="px-4 py-2 text-right">{formatTimeSeconds(row.time)}</td>
      <td className="px-4 py-2 text-right">{formatDate(row.date, "long")}</td>
    </tr>
  );
}
