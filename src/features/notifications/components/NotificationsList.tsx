import type { AppNotification } from "../types";
import { NotificationItem } from "./NotificationItem";

interface NotificationsListProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
}

export function NotificationsList({
  notifications,
  onMarkAsRead,
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
      {notifications.map((item) => (
        <NotificationItem
          key={item.id}
          notification={item}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </ul>
  );
}
