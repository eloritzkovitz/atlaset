import type { Timestamp } from "firebase/firestore";

/** Supported social platforms for user profiles. */
export type SocialPlatform =
  | "x"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "github"
  | "website";

/** User profile information. */
export interface UserProfile {
  /** User ID */
  uid: string;
  /** Unique username */
  username: string;
  /** Display name */
  displayName: string;
  /** Profile photo URL */
  photoURL?: string;
  /** Email */
  email?: string;
  /** Home country code (ISO 3166-1 alpha-2) */
  homeCountry?: string;
  /** Birthday */
  birthday?: Timestamp;
  /** Short biography */
  biography?: string;
  /** Social links */
  socialLinks?: Partial<Record<SocialPlatform, string>>;
  /** Whether the profile is public */
  isPublic: boolean;
  /** Account creation date */
  joinDate?: Timestamp;
  /** List of visited country codes (ISO 3166-1 alpha-2) */
  visitedCountryCodes: string[];
  /** List of country codes (ISO 3166-1 alpha-2) the user wants to visit */
  wantToVisitCountryCodes: string[];
}

/** Activity details associated with a user activity. */
export interface ActivityDetails extends Record<string, unknown> {
  itemName?: string;
  location?: string;
  date?: string;
  userName?: string;
}

/** User activity log entry. */
export interface UserActivity {
  id: string;
  action: number;
  timestamp: number | string | Date;
  details?: ActivityDetails;
}

/** Device information associated with a user. */
export type Device = {
  userAgent?: string;
  deviceName?: string;
  id: string;
  lastActive?: number;
};

/** Friend request information. */
export interface FriendRequest {
  /** User ID of the friend request */
  uid: string;
  /** User ID of the sender */
  from: string;
  /** User ID of the receiver */
  to: string;
  /** Timestamp when the friend request was created */
  createdAt: Timestamp;
}

/** Friend information. */
export interface Friend {
  /** User ID of the friend */
  uid: string;
  /** Timestamp when the friendship was created */
  createdAt: Timestamp;
}

/**
 * Friend profile information (subset of UserProfile, used for friend lists/search)
 */
export type FriendProfile = Pick<
  UserProfile,
  "uid" | "username" | "displayName" | "photoURL"
>;
