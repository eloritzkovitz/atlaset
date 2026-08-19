import {
  addDoc,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db, getPaths } from "@lib/firebase";
import type { CreateNotificationInput } from "../types";

/** Service for managing notifications. */
export const notificationService = {
  /** Sends a notification to a user. */
  async send(
    recipientId: string,
    input: CreateNotificationInput,
  ): Promise<void> {
    if (recipientId === input.actor?.uid) return;

    const notificationsRef = getPaths.sub(recipientId, "notifications");

    await addDoc(notificationsRef, {
      ...input,
      recipientId,
      read: false,
      createdAt: serverTimestamp(),
    });
  },

  /** Marks a notification as read for a user. */
  async markAsRead(recipientId: string, notificationId: string): Promise<void> {
    const notificationRef = getPaths.subDoc(
      recipientId,
      "notifications",
      notificationId,
    );

    await updateDoc(notificationRef, {
      read: true,
    });
  },

  /** Marks all notifications as read for a user. */
  async markAllAsRead(
    recipientId: string,
    notificationIds: string[],
  ): Promise<void> {
    if (notificationIds.length === 0) return;

    const batch = writeBatch(db);

    notificationIds.forEach((notificationId) => {
      const notificationRef = getPaths.subDoc(
        recipientId,
        "notifications",
        notificationId,
      );

      batch.update(notificationRef, {
        read: true,
      });
    });

    await batch.commit();
  },
};
