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
    <ul>
      {notifications.map((item) => (
        <NotificationItem key={item.id} notification={item} />
      ))}
    </ul>
  );
}
