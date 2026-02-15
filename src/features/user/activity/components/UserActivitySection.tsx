import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteScroll } from "@hooks";
import { UserActivityItem } from "./UserActivityItem";
import { useUserActivity } from "../hooks/useUserActivity";
import { useAuth } from "../../auth/hooks/useAuth";

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
  const { activity, loading, hasMore, loadMore, deleteActivity } =
    useUserActivity();

  // Infinite scroll hook
  const loaderRef = useInfiniteScroll(loadMore, hasMore && !loading);

  // If user is not authenticated, don't render the activity section
  if (!user) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 self-start">Activity Log</h2>
      {loading && activity.length === 0 ? (
        <div className="text-muted">Loading...</div>
      ) : activity.length === 0 ? (
        <div className="text-muted">No activity yet.</div>
      ) : (
        <>
          <ul className="space-y-4">
            {activity.map((act) => (
              <UserActivityItem
                key={act.id}
                activity={act}
                onDelete={deleteActivity}
              />
            ))}
          </ul>
          {hasMore && !loading && activity.length > 0 && (
            <div ref={loaderRef} />
          )}
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
