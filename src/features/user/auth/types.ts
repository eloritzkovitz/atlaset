/** Represents a user for serialization purposes, containing only serializable fields from the Firebase User object. */
export interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  providerId: string;
  createdAt: string | null;
  lastSignInTime: string | null;
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
