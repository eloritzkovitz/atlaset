import { useRef } from "react";
import { useAuth } from "@contexts/AuthContext";
import { UserActivityItem } from "./UserActivityItem";
import { useUserActivity } from "../../hooks/useUserActivity";
import { useInfiniteScroll } from "@hooks/useInfiniteScroll";

export function UserActivitySection() {
  const { user } = useAuth();
  const { activity, loading, hasMore, loadMore } = useUserActivity(user?.uid);

  // Use infinite scroll
  const loaderRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll(loaderRef, loadMore, hasMore && !loading);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Activity</h3>
      {loading && activity.length === 0 ? (
        <div className="text-gray-400">Loading...</div>
      ) : activity.length === 0 ? (
        <div className="text-gray-400">No activity yet.</div>
      ) : (
        <>
          <ul className="space-y-4">
            {activity.map((act) => (
              <UserActivityItem key={act.id} act={act} />
            ))}
          </ul>
          <div ref={loaderRef} />
          {loading && (
            <div className="flex justify-center mt-4">
              <span className="text-gray-400">Loading...</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
