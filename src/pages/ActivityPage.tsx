import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Container, EmptyListMessage, PageHeader } from "@components";
import { UserActivityItem, useUserActivity } from "@features/activity";
import { useAuth } from "@features/user/auth";
import { useInfiniteScroll, usePageTitle } from "@hooks";

export default function ActivityPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("activity");

  usePageTitle(t("activityLog", "Activity Log"));

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const { activity, loading, hasMore, loadMore, deleteActivity } =
    useUserActivity();

  const loaderRef = useInfiniteScroll(loadMore, hasMore && !loading);

  // Don't render if no user
  if (!user) return null;

  const isEmpty = activity.length === 0;

  return (
    <Container className="mt-12">
      <PageHeader
        title={t("ui.activityLog", "Activity Log")}
        fallbackPath="/"
      />
      {loading && isEmpty ? (
        <div className="text-muted">{t("ui.loading")}</div>
      ) : isEmpty ? (
        <EmptyListMessage message={t("ui.noActivity")} />
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
          {hasMore && !loading && <div ref={loaderRef} />}
          {loading && (
            <div className="flex justify-center mt-4">
              <span className="text-muted">{t("ui.loading")}</span>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
