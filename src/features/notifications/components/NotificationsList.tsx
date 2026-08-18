import { NotificationItem } from "./NotificationItem";
import type { AppNotification } from "../types";

interface NotificationsListProps {
  notifications: AppNotification[];
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
      {notifications.map((item) => (
        <NotificationItem key={item.id} notification={item} />
      ))}
    </ul>
  );
}
