/**
 * Utility functions for Firebase authentication and Firestore user collections.
 */

import { getAuth } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";

/**
 * Checks if a user is authenticated.
 * @returns True if a user is authenticated, false otherwise.
 */
export function isAuthenticated() {
  return !!getAuth().currentUser;
}

/**
 * Gets the currently authenticated user.
 * @returns The currently authenticated user, or null if no user is authenticated.
 */
export function getCurrentUser() {
  return getAuth().currentUser;
}

/**
 * Gets a Firestore collection reference for a user's subcollection.
 * @param path The path within the user's collection.
 * @returns The Firestore collection reference for the user's subcollection at the specified path.
 */
export function getUserCollection(path: string) {
  const user = getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  return collection(db, "users", user.uid, path);
}

/**
 * Logs a user activity event to Firestore.
 * @param action The action performed (e.g., "edit_profile", "create_trip").
 * @param details Optional details about the action.
 */
export async function logUserActivity(action: string, details: object = {}) {
  const activityCollection = getUserCollection("activity");
  await addDoc(activityCollection, {
    action,
    details,
    timestamp: Date.now(),
  });
}
