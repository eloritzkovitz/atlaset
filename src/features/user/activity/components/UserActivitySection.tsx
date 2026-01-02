import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { useInfiniteScroll } from "@hooks";
import { UserActivityItem } from "./UserActivityItem";
import { useUserActivity } from "../hooks/useUserActivity";

export function UserActivitySection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Only fetch activity if user is loaded
  const { activity, loading, hasMore, loadMore } = useUserActivity(user?.uid);

  const loaderRef = useInfiniteScroll(loadMore, hasMore && !loading);

  if (!user) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Activity</h3>
      {loading && activity.length === 0 ? (
        <div className="text-muted">Loading...</div>
      ) : activity.length === 0 ? (
        <div className="text-muted">No activity yet.</div>
      ) : (
        <>
          <ul className="space-y-4">
            {activity.map((act) => (
              <UserActivityItem key={act.id} act={act} />
            ))}
          </ul>
          {hasMore && !loading && activity.length > 0 && <div ref={loaderRef} />}
          {loading && (
            <div className="flex justify-center mt-4">
              <span className="text-muted">Loading...</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
