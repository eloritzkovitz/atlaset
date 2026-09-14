/**
 * Utility functions for handling trip permissions.
 */

import type { SharedTrip, Trip } from "../types";

/**
 * Determines if the user is a viewer of the trip.
 * @param sharedTrip - The shared trip object containing permission information.
 * @returns True if the user is a viewer, false otherwise.
 */
export function isTripViewer(sharedTrip: SharedTrip | undefined): boolean {
  return sharedTrip?.permission === "viewer";
}

/**
 * Determines if the user is an editor of the trip.
 * @param sharedTrip - The shared trip object containing permission information.
 * @returns True if the user is an editor, false otherwise.
 */
export function isTripEditor(sharedTrip: SharedTrip | undefined): boolean {
  return sharedTrip?.permission === "editor";
}

/**
 * Determines if the current user can edit a trip based on their role and permissions.
 * @param trip - The trip object to check permissions for.
 * @param currentUserUid - The UID of the current user.
 * @param ownerUid - The UID of the trip owner.
 * @param sharedTrip - Optional shared trip object containing permission information.
 * @returns True if the user can edit the trip, false otherwise.
 */
export function canEditTrip(
  trip: Trip,
  currentUserUid: string,
  ownerUid: string,
  sharedTrip?: SharedTrip,
): boolean {
  if (currentUserUid === ownerUid) {
    return true;
  }

  return (
    trip.sharedWith?.includes(currentUserUid) === true &&
    isTripEditor(sharedTrip)
  );
}
