import { FaRegClock } from "react-icons/fa6";
import { getActivityDescription } from "../utils/activity";
import type { UserActivity, ActivityDetails } from "../../types";

export function UserActivityItem({ act }: { act: UserActivity }) {
  const details: ActivityDetails | undefined =
    act.details &&
    typeof act.details === "object" &&
    !Array.isArray(act.details)
      ? act.details
      : undefined;

  return (
    <li className="p-4 rounded-xl bg-gray-300 dark:bg-gray-600 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <FaRegClock className="inline-block mr-1" />
        <span className="font-semibold text-base text-white">
          {getActivityDescription(act.action, details)}
        </span>
        <span className="flex items-center text-xs text-muted ml-2 gap-1">
          {new Date(act.timestamp).toLocaleString()}
        </span>
      </div>
    </li>
  );
}
