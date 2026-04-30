import { Link } from "react-router-dom";
import { DirectionalIcon } from "@components";
import { UserActivityItem } from "./UserActivityItem";
import { useUserActivity } from "../hooks/useUserActivity";

export function RecentActivitySection({ limit = 5 }: { limit?: number }) {
  const { activity, loading: activityLoading } = useUserActivity();
  const recentActivity = activity.slice(0, limit);

  return (
    <div className="mt-10">
      <Link
        to="/activity"
        className="flex items-center text-xl font-semibold mb-4 gap-2 focus:outline-none"
        aria-label="View full activity log"
      >
        <span>Activity</span>
        <DirectionalIcon direction="next" className="text-base" />
      </Link>
      {activityLoading && recentActivity.length === 0 ? (
        <div className="text-muted">Loading...</div>
      ) : recentActivity.length === 0 ? (
        <div className="text-muted">No activity yet.</div>
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
