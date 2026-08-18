import { useEffect, useState } from "react";
import { query, orderBy, onSnapshot } from "firebase/firestore";
import { getPaths } from "@lib/firebase";
import type { AppNotification } from "../types";
import { notificationService } from "../services/notificationService";

/**
 * Manages notifications for a specific recipient in real-time.
 * @param recipientId - The ID of the recipient for whom to fetch notifications.
 * @returns Notifications, unread count, loading/error state, and read actions.
 */
export const useNotifications = (recipientId: string | undefined) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetches notifications in real-time for the specified recipient
  useEffect(() => {
    if (!recipientId) {
      setNotifications([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const notificationsRef = getPaths.sub(recipientId, "notifications");

    const notificationsQuery = query(
      notificationsRef,
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const items = snapshot.docs.map((snapshotDoc) => ({
          ...snapshotDoc.data(),
          id: snapshotDoc.id,
        }));

        setNotifications(items);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to subscribe to notifications:", err);
        setError(err);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [recipientId]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  // Marks a specific notification as read for the current recipient
  const markAsRead = async (notificationId: string) => {
    if (!recipientId) return;

    await notificationService.markAsRead(recipientId, notificationId);
  };

   // Marks all notifications as read for the current recipient
  const markAllAsRead = async () => {
    if (!recipientId) return;

    const unreadIds = notifications
      .filter((notification) => !notification.read)
      .map((notification) => notification.id);

    if (unreadIds.length === 0) return;

    await notificationService.markAllAsRead(recipientId, unreadIds);
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
  };
};
