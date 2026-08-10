/**
 * Utility functions for user authentication providers.
 */

import type { User } from "firebase/auth";
import { auth } from "@lib/firebase/config";
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
 * Ensures a Firebase user is authenticated and throws an error if missing.
 * @param userState - The current serializable user state.
 * @returns The authenticated Firebase User object.
 * @throws Error if no authenticated user is found.
 */
export function requireCurrentUser(userState?: SerializableUser | null) {
  const currentUser = auth.currentUser;
  if (!currentUser || userState === null) {
    throw new Error("No authenticated user found.");
  }
  return currentUser;
}
