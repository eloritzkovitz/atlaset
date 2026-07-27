/**
 * Utility functions for user authentication providers.
 */

import type { User } from "firebase/auth";
import type { SerializableUser } from "../types";

export interface MinimalProviderData {
  providerId: string;
}

/**
 * Extracts pure serializable fields from a native Firebase User SDK instance.
 * @param user - The Firebase User object.
 * @returns A serializable user object or null if the user is null.
 */
export function toSerializableUser(user: User | null): SerializableUser | null {
  if (!user) return null;  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    phoneNumber: user.phoneNumber,
    providerId: user.providerId,
    createdAt: user.metadata?.creationTime || null,
    lastSignInTime: user.metadata?.lastSignInTime || null,
  };
}

/**
 * Checks if the user signed up using email/password provider.
 * @param providerData - The provider data array.
 * @returns True if the user is a password provider, false otherwise.
 */
export function isPasswordProvider(
  providerData: MinimalProviderData[] | undefined | null,
): boolean {
  return !!providerData?.some((p) => p.providerId === "password");
}

/**
 * Validates if a given user is deactivated.
 */
export function isUserDeactivated(status: string | undefined | null): boolean {
  return status === "deactivated";
}
