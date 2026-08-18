import type { FieldValue, Timestamp } from "firebase/firestore";
import type { UserProfile } from "../profile/types";

/** Firestore data for a friend request. */
export interface FriendRequestData {
  /** User ID of the sender. */
  from: string;
  /** User ID of the receiver. */
  to: string;
  /** Timestamp when the friend request was created. */
  createdAt: Timestamp | FieldValue;
}

/** Represents a friend request. */
export interface FriendRequest extends FriendRequestData {
  uid: string;
}

/** Represents a friend. */
export interface Friend {
  /** User ID of the friend. */
  uid: string;
  /** Timestamp when the friendship was created. */
  createdAt: Timestamp | FieldValue | string;
}

/** Represents a friend's profile information. */
export type FriendProfile = Pick<
  UserProfile,
  "uid" | "username" | "displayName" | "photoURL"
>;
