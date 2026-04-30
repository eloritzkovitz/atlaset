import React from "react";
import { FaTrash } from "react-icons/fa6";
import { ActionButton } from "@components";
import { getActivityDescription, getActivityIcon } from "../utils/activity";
import type { UserActivity, ActivityDetails } from "../../types";

interface UserActivityItemProps {
  activity: UserActivity;
  onDelete?: (id: string) => void;
}

/** Renders a single user activity item.
 * @param activity - The user activity data to display.
 * @param onDelete - Optional callback to delete the activity.
 */
export const UserActivityItem = React.memo(function UserActivityItem({
  activity,
  onDelete,
}: UserActivityItemProps) {
  const details: ActivityDetails =
    activity.details &&
    typeof activity.details === "object" &&
    !Array.isArray(activity.details)
      ? activity.details
      : ({} as ActivityDetails);

  return (
    <li className="p-4 rounded-xl bg-surface-alt hover:bg-primary/30 flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <span className="inline-block me-1">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-surface">
            <span className="text-lg">{getActivityIcon(activity.action)}</span>
          </span>
        </span>
        <div className="flex-1 flex flex-col">
          <span className="font-semibold text-base">
            {getActivityDescription(
              activity.action,
              details as Record<string, unknown>,
            )}
          </span>
          <span className="flex items-center text-xs text-muted mt-1">
            {new Date(activity.timestamp).toLocaleString()}
          </span>
        </div>
        {onDelete && (
          <ActionButton
            className="ms-2 text-danger hover:text-hover"
            icon={<FaTrash />}
            ariaLabel="Delete activity"
            title="Delete activity"
            onClick={() => onDelete(activity.id)}
            rounded
          />
        )}
      </div>
    </li>
  );
});
