import type { Timestamp } from "firebase/firestore";
import type { Action } from "@constants/actions";

/** Represents the actor associated with a notification. */
export type NotificationActor = {
  uid: string;
  displayName: string;
  photoURL: string;
};

/** Represents the details for customizing a notification message. */
export type NotificationDetails = {
  actorName?: string;
  itemId?: string;
  itemName?: string;
};

/** Represents a notification. */
export type AppNotification = {
  id: string;
  recipientId: string;
  actor?: NotificationActor;
  details?: NotificationDetails;
  action: Action;
  read: boolean;
  createdAt: Timestamp;
};

/** Represents the input for creating a new notification. */
export type CreateNotificationInput = Omit<
  AppNotification,
  "id" | "recipientId" | "createdAt" | "read"
>;
