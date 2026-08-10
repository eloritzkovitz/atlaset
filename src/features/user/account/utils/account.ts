/**
 * Utility functions for user account management.
 */

/**
 * Validates if a given user is deactivated.
 * @param status - The status string of the user.
 * @returns True if the user is deactivated, false otherwise.
 */
export function isUserDeactivated(status: string | undefined | null): boolean {
  return status === "deactivated";
}
