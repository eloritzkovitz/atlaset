import type { Timestamp } from "firebase/firestore";

/** User profile information */
export interface UserProfile {
  /** User ID */
  uid: string;
  /** Unique username */
  username: string;
  /** Display name */
  displayName: string;
  /** Profile photo URL */
  photoURL?: string;
  /** email */
  email?: string;
  /** Short biography */
  biography?: string;
  /** Whether the profile is public */
  isPublic: boolean;
  /** Account creation date */
  joinDate?: Timestamp;
  /** Home country code (ISO 3166-1 alpha-2) */
  homeCountry?: string;
  /** List of visited country codes (ISO 3166-1 alpha-2) */
  visitedCountryCodes: string[];  
}

/** Activity details associated with a user activity */
export interface ActivityDetails {
  itemName?: string;
  location?: string;
  date?: string;
  userName?: string;
}

/** User activity log entry */
export interface UserActivity {
  id: string;
  action: string;
  timestamp: number | string | Date;
  details?: ActivityDetails;
}

/** Device information associated with a user */
export type Device = {
  userAgent?: string;
  deviceName?: string;
  id: string;
  lastActive?: number;
};
