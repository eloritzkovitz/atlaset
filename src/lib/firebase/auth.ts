/**
 * Utility functions for Firebase authentication.
 */

import { auth } from "./config";

/**
 * Checks if a user is authenticated.
 * @returns True if a user is authenticated, false otherwise.
 */
export function isAuthenticated() {
  return !!auth.currentUser;
}

/**
 * Gets the currently authenticated user.
 * @returns The currently authenticated user, or null if no user is authenticated.
 */
export function getCurrentUser() {
  return auth.currentUser;
}
