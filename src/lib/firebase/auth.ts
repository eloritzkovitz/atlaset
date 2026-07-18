/**
 * Utility functions for Firebase authentication.
 */

import { getAuth } from "firebase/auth";

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
