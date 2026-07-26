import { FaMedal } from "react-icons/fa6";
import { UserInfo } from "@features/user/profile/components/UserInfo";
import { formatTimeSeconds, formatDate } from "@utils/date";
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
  const playerProfile: UserProfile = {
    uid: row.playerId,
    displayName: row.playerName,
    username: row.username || "unknown",
    photoURL: row.photoURL,
    isPublic: true,
    visitedCountryCodes: [],
    wantToVisitCountryCodes: [],
  };

  return (
    <tr
      key={row.playerName + row.rank}
      className={`hover:bg-base-200 transition ${
        index % 2 === 0 ? "bg-base-100" : "bg-base-300"
      }`}
    >
      <td className="px-4 py-2 font-bold">
        {index === 0 ? (
          <FaMedal
            className="text-yellow-400 drop-shadow-sm"
            title="1st Place"
          />
        ) : index === 1 ? (
          <FaMedal className="text-gray-400 drop-shadow-sm" title="2nd Place" />
        ) : index === 2 ? (
          <FaMedal
            className="text-orange-500 drop-shadow-sm"
            title="3rd Place"
          />
        ) : (
          row.rank
        )}
      </td>
      <td className="px-4 py-2">
        <UserInfo
          user={playerProfile}
          showDisplayName={true}
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
