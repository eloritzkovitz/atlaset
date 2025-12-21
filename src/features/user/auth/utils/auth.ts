/**
 * @file Contains utility functions for user authentication providers
 */

import type { User, UserInfo } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

/**
 * Checks if the user signed up using email/password provider
 * @param user - The user object
 * @returns True if the user is a password provider, false otherwise
 */
export function isPasswordProvider(user: User | null | undefined) {
  return user?.providerData?.some((p: UserInfo) => p.providerId === "password");
}

/**
 * Checks if a user is deactivated and reactivates them if so
 * @param user - The user object
 * @returns A promise that resolves to true if the user was reactivated, false otherwise
 */
export async function checkAndReactivateUser(user: User): Promise<boolean> {
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists() && userDoc.data().status === "deactivated") {
    await setDoc(
      userDocRef,
      { status: "active", reactivatedAt: new Date().toISOString() },
      { merge: true }
    );
    return true;
  }
  return false;
}
