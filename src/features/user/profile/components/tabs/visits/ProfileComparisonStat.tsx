import { FaCrown } from "react-icons/fa6";
import { UserAvatar } from "../../UserAvatar";
import type { UserProfile } from "../../../types";

interface ProfileComparisonStatProps {
  user: UserProfile;
  count: number;
  label: string;
  isWinner?: boolean;
}

export function ProfileComparisonStat({
  user,
  count,
  label,
  isWinner = false,
}: ProfileComparisonStatProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <UserAvatar user={user} size={32} />

        <div className="flex items-center gap-1">
          {isWinner && (
            <FaCrown
              className="text-yellow-500"
              title="Most countries visited"
            />
          )}

          <div className="text-2xl font-bold">{count}</div>
        </div>
      </div>

      <div className="mt-2 text-muted">{label}</div>
    </div>
  );
}
