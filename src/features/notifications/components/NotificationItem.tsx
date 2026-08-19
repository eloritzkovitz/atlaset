import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MenuButton } from "@components";
import { ACTIONS } from "@constants/actions";
import { ICONS } from "@constants/icons";
import { useAuth } from "@features/user/auth/hooks/useAuth";
import { UserAvatar } from "@features/user/profile";
import { profileService } from "@features/user/profile/services/profileService";
import { formatTimeAgo } from "@utils";
import { notificationService } from "../services/notificationService";
import type { AppNotification } from "../types";
import { getNotificationMessage } from "../utils/notifications";

interface NotificationItemProps {
  notification: AppNotification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { user } = useAuth();
  const { t } = useTranslation("common");

  const [profileUrl, setProfileUrl] = useState<string>();

  // Determines if the notification is related to a profile action
  const isProfileNotification =
    notification.action === ACTIONS.FRIEND_REQUEST_SENT ||
    notification.action === ACTIONS.FRIEND_REQUEST_ACCEPTED;

  // Determines if the notification is related to a trip action
  const isTripNotification =
    notification.action === ACTIONS.TRIP_PARTICIPANT_ADDED ||
    notification.action === ACTIONS.TRIP_PARTICIPANT_REMOVED;

  // Fetches the profile URL for the actor if the notification is related to a profile action
  useEffect(() => {
    if (!isProfileNotification || !notification.actor?.uid) return;

    profileService.getProfile(notification.actor.uid).then((profile) => {
      if (profile?.username) {
        setProfileUrl(`/users/${profile.username}`);
      }
    });
  }, [isProfileNotification, notification.actor?.uid]);

  // Determines the URL to navigate to based on the notification type
  const url = isProfileNotification
    ? profileUrl
    : isTripNotification
      ? "/trips"
      : undefined;

  const message = getNotificationMessage(notification.action, {
    actorName: notification.actor?.displayName,
    itemName: notification.details?.itemName,
  });

  // Handles the click event for the notification item, marking it as read if applicable
  const handleClick = () => {
    if (!user || notification.read) return;

    notificationService.markAsRead(user.uid, notification.id).catch((error) => {
      console.error("Failed to mark notification as read:", error);
    });
  };

  return (
    <li>
      <MenuButton
        url={url}
        onClick={handleClick}
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

        <div className="flex flex-col flex-1 text-start">
          <p className="text-sm line-clamp-2 leading-relaxed">{message}</p>

          <span className="text-xs text-muted mt-0.5">
            {formatTimeAgo(notification.createdAt, t)}
          </span>
        </div>
      </MenuButton>
    </li>
  );
}
