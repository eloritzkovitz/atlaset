import { FaRegClock, FaTrash } from "react-icons/fa6";
import { ActionButton } from "@components";
import { getActivityDescription } from "../utils/activity";
import type { UserActivity, ActivityDetails } from "../../types";

interface UserActivityItemProps {
  activity: UserActivity;
  onDelete?: (id: string) => void;
}

/** Renders a single user activity item.
 * @param act - The user activity data to display.
 * @param onDelete - Optional callback to delete the activity.
 */
export function UserActivityItem({ activity, onDelete }: UserActivityItemProps) {
  const details: ActivityDetails =
    activity.details &&
    typeof activity.details === "object" &&
    !Array.isArray(activity.details)
      ? activity.details
      : ({} as ActivityDetails);

  return (
    <li className="p-4 rounded-xl bg-gray-300 dark:bg-gray-600 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <FaRegClock className="inline-block mr-1" />
        <span className="font-semibold text-base text-white">
          {getActivityDescription(
            activity.action,
            details as Record<string, unknown>,
          )}
        </span>
        <span className="flex items-center text-xs text-muted ml-2 gap-1">
          {new Date(activity.timestamp).toLocaleString()}
        </span>
        {onDelete && (
          <ActionButton
            className="ml-auto"
            icon={<FaTrash />}
            ariaLabel="Delete activity"
            title="Delete activity"
            onClick={() => onDelete(activity.id)}
          />
        )}
      </div>
    </li>
  );
}
