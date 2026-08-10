/** Represents the authentication method used. */
export type AuthMethod = "email" | "email_persistent" | "google";

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
