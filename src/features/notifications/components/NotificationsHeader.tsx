import { useTranslation } from "react-i18next";
import { SectionHeader } from "@components";

interface NotificationsHeaderProps {
  unreadCount: number;
  hasNotifications: boolean;
  onMarkAllAsRead: () => void;
  onClearAll?: () => void;
}

export function NotificationsHeader({
  unreadCount,
  hasNotifications,
  onMarkAllAsRead,
  onClearAll,
}: NotificationsHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center">
      <SectionHeader
        title={t("navigation.menu.notifications", "Notifications")}
        className="ms-2 flex-1"
      />
      {unreadCount > 0 && (
        <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
          {unreadCount}
        </span>
      )}

      {hasNotifications && (
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-xs text-primary hover:underline font-medium transition-colors"
            >
              {t("notifications.markAllRead", "Mark all as read")}
            </button>
          )}
          {onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-text-muted hover:text-text font-medium transition-colors"
            >
              {t("notifications.clearAll", "Clear all")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
