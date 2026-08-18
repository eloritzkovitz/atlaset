import { useTranslation } from "react-i18next";
import { MenuButton } from "@components";
import { ICONS } from "@constants/icons";
import { UserAvatar } from "@features/user/profile";
import { formatTimeAgo } from "@utils";
import type { AppNotification } from "../types";
import { getNotificationMessage } from "../utils/notifications";

interface NotificationItemProps {
  notification: AppNotification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const { t } = useTranslation("common");

  const message = getNotificationMessage(notification.action, {
    actorName: notification.actor?.displayName,
    itemName: notification.details?.itemName,
  });

  return (
    <li>
      <MenuButton
        type="button"
        onClick={() => !notification.read && onMarkAsRead(notification.id)}
        className={`w-full flex items-center py-2.5 transition-colors ${
          !notification.read ? "font-medium" : "opacity-80"
        }`}
      >
        {!notification.read && (
          <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
        )}

        <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center flex-shrink-0">
          {notification.actor ? (
            <UserAvatar user={notification.actor} size={40} />
          ) : (
            <ICONS.notifications />
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0 text-start">
          <p className="text-sm line-clamp-2 leading-relaxed">{message}</p>
          <span className="text-xs text-muted mt-0.5">
            {formatTimeAgo(notification.createdAt, t)}
          </span>
        </div>
      </MenuButton>
    </li>
  );
}
