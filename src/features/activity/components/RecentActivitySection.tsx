import { useTranslation } from "react-i18next";
import { SectionLink } from "@components";
import { UserActivityItem } from "./UserActivityItem";
import { useUserActivity } from "../hooks/useUserActivity";

export function RecentActivitySection({ limit = 5 }: { limit?: number }) {
  const { activity, loading: activityLoading } = useUserActivity();
  const recentActivity = activity.slice(0, limit);
  const { t } = useTranslation("activity");

  return (
    <div className="mt-10">
      <SectionLink to="/activity" label={t("ui.title")} align="left" />
      {activityLoading && recentActivity.length === 0 ? (
        <div className="text-muted">{t("ui.loading")}</div>
      ) : recentActivity.length === 0 ? (
        <div className="text-muted">{t("ui.noActivity")}</div>
      ) : (
        <ul className="space-y-3">
          {recentActivity.map((act) => (
            <UserActivityItem key={act.id} activity={act} />
          ))}
        </ul>
      )}
    </div>
  );
}
