import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DirectionalIcon } from "@components";
import { useAuth } from "@features/user/auth";
import { useInfiniteScroll } from "@hooks";
import { UserActivityItem } from "./UserActivityItem";
import { useUserActivity } from "../hooks/useUserActivity";

export function UserActivitySection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("activity");

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
          aria-label={t("ui.goBack")}
        >
          <span className="inline-flex items-center gap-1">
            <DirectionalIcon direction="prev" className="text-lg" />
            <h2 className="text-xl font-bold self-start">
              {t("ui.activityLog")}
            </h2>
          </span>
        </button>
      </div>
      {loading && activity.length === 0 ? (
        <div className="text-muted">{t("ui.loading")}</div>
      ) : activity.length === 0 ? (
        <div className="text-muted">{t("ui.noActivity")}</div>
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
              <span className="text-muted">{t("ui.loading")}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
