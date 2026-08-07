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
  /** Whether search indexing is allowed */
  isSearchIndexingAllowed?: boolean;
  /** Account creation date */
  joinDate?: Timestamp;
  /** List of visited country codes (ISO 3166-1 alpha-2) */
  visitedCountryCodes?: string[];
  /** List of manually added visited country codes (ISO 3166-1 alpha-2) */
  manualVisitedCountryCodes?: string[];
  /** List of country codes (ISO 3166-1 alpha-2) the user wants to visit */
  wantToVisitCountryCodes?: string[];
}

/** Represents a user in the Firestore database. */
export interface FirestoreUser extends UserProfile {
  status?: "active" | "deactivated";
  deactivatedAt?: string;
  reactivatedAt?: string;
}

/** Represents the validation status of a username. */
export type UsernameValidationStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "invalid";
