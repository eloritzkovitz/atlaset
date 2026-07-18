import type { Timestamp } from "firebase/firestore";

/** Supported social platforms for user profiles. */
export type SocialPlatform =
  | "x"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "github"
  | "website";

/** Represents a user profile. */
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

/** Represents a user session. */
export type UserSession = {
  /** Document ID. */
  id: string;
  /** User ID. */
  userId: string;
  /** Session ID. */
  sessionId: string;
  /** User agent string. */
  userAgent: string;
  /** Browser language preference. */
  language: string;
  /** Display resolution dimensions. */
  screen: string;
  /** IP address. */
  ipAddress?: string;
  /** Location. */
  location?: string;
  /** Epoch timestamp tracking recent interactions. */
  lastActive: number;
  /** Optional user-assigned friendly name. */
  deviceName?: string;
};

/** Represents a friend request. */
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

/** Represents a friend's profile information. */
export type FriendProfile = Pick<
  UserProfile,
  "uid" | "username" | "displayName" | "photoURL"
>;
