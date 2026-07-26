import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "@components";
import { ICONS } from "@constants/icons";
import { formatDate } from "@utils/date";
import type { UserActivity, ActivityDetails } from "../types";
import { getActivityDescription, getActivityIcon } from "../utils/activity";

interface UserActivityItemProps {
  activity: UserActivity;
  onDelete?: (activity: UserActivity) => void;
}

/** Renders a single user activity item.
 * @param activity - The user activity data to display.
 * @param onDelete - Optional callback to delete the activity.
 */
export const UserActivityItem = React.memo(function UserActivityItem({
  activity,
  onDelete,
}: UserActivityItemProps) {
  const { t } = useTranslation("activity");
  const details: ActivityDetails = activity.details || ({} as ActivityDetails);

  // Get the appropriate icon for the activity action
  const Icon = getActivityIcon(activity.action);

  // Get structured description segments
  const descriptionSegments = getActivityDescription(
    activity.action,
    details as Record<string, unknown>,
  );

  return (
    <li className="p-4 rounded-xl bg-surface-alt hover:bg-primary/30 flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <span className="inline-block me-1">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-surface">
            <span className="text-lg">
              <Icon />
            </span>
          </span>
        </span>
        <div className="flex-1 flex flex-col">
          <span className="font-semibold text-base">
            {descriptionSegments.map((segment, index) => {
              if (segment.type === "username") {
                return (
                  <span
                    key={index}
                    className="font-bold text-action-text-hover"
                  >
                    {segment.text}
                  </span>
                );
              }
              if (segment.type === "item") {
                return (
                  <span key={index} className="text-info font-bold">
                    {segment.text}
                  </span>
                );
              }
              return (
                <React.Fragment key={index}>{segment.text}</React.Fragment>
              );
            })}
          </span>
          <span className="flex items-center text-xs text-muted mt-1">
            {formatDate(activity.timestamp, "long")}
          </span>
        </div>
        {onDelete && (
          <ActionButton
            className="ms-2 text-danger hover:text-hover"
            icon={<ICONS.remove />}
            ariaLabel={t("ui.deleteActivityTitle")}
            title={t("ui.deleteActivityTitle")}
            onClick={() => onDelete(activity)}
            rounded
          />
        )}
      </div>
    </li>
  );
});
