import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DirectionalIcon } from "@components";
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
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1) || navigate("/dashboard")}
          className="flex items-center focus:outline-none"
          aria-label="Go back"
        >
          <span className="inline-flex items-center gap-1">
            <DirectionalIcon direction="prev" className="text-lg" />
            <h2 className="text-xl font-bold self-start">Activity Log</h2>
          </span>
        </button>
      </div>
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
