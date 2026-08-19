import { useTranslation } from "react-i18next";
import { EmptyListMessage, SectionHeader } from "@components";
import { NotificationsList } from "./NotificationsList";
import type { AppNotification } from "../types";

interface NotificationsContentProps {
  notifications: AppNotification[];
  loading: boolean;
  containerClassName?: string;
}

export function NotificationsContent({
  notifications,
  loading,
  containerClassName = "",
}: NotificationsContentProps) {
  const { t } = useTranslation("notifications");

  return (
    <div className={`flex h-full flex-col ${containerClassName}`}>
      <SectionHeader
        title={t("ui.title", "Notifications")}
        className="ms-2 shrink-0"
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <EmptyListMessage message={t("common:loading", "Loading...")} />
        ) : notifications.length === 0 ? (
          <EmptyListMessage message={t("ui.empty", "No notifications")} />
        ) : (
          <NotificationsList notifications={notifications} />
        )}
      </div>
    </div>
  );
}
