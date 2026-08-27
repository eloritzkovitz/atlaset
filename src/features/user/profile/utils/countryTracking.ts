/**
 * Utility functions for user profile country tracking and comparison.
 */

import type { CountryTrackingComparison, UserProfile } from "../types";

/**
 * Returns a unique list of all visited country codes for a given user profile, combining both manual and trip-based entries.
 * @param profileUser - The user profile object containing visited country codes.
 * @returns An array of unique country codes that the user has visited.
 */
export function getAllVisitedCountryCodes(profileUser: UserProfile): string[] {
  const manual = profileUser.manualVisitedCountryCodes ?? [];
  const tripBased = profileUser.visitedCountryCodes ?? [];

  return Array.from(new Set([...manual, ...tripBased]));
}

/**
 * Returns the intersection of two arrays of strings.
 * @param first - The first array of strings.
 * @param second - The second array of strings.
 * @returns An array containing the elements that are present in both input arrays.
 */
function getIntersection(first: string[], second: string[]): string[] {
  const secondSet = new Set(second);

  return first.filter((code) => secondSet.has(code));
}

/**
 * Returns the difference between two arrays of strings, specifically the elements that are present in the first array but not in the second.
 * @param first - The first array of strings.
 * @param second - The second array of strings.
 * @returns An array containing the elements that are present in the first array but not in the second.
 */
function getDifference(first: string[], second: string[]): string[] {
  const secondSet = new Set(second);

  return first.filter((code) => !secondSet.has(code));
}

/**
 * Compares two users' country tracking data and returns the differences and similarities.
 * @param currentUserVisited - The list of country codes that the current user has visited.
 * @param otherUserVisited - The list of country codes that the other user has visited.
 * @param currentUserWantToVisit - The list of country codes that the current user wants to visit.
 * @param otherUserWantToVisit - The list of country codes that the other user wants to visit.
 * @returns An object containing the shared and unique country codes for both visited and want-to-visit categories.
 */
export function compareCountryTracking(
  currentUserVisited: string[],
  otherUserVisited: string[],
  currentUserWantToVisit: string[],
  otherUserWantToVisit: string[],
): CountryTrackingComparison {
  return {
    visited: {
      shared: getIntersection(currentUserVisited, otherUserVisited),
      currentUser: getDifference(currentUserVisited, otherUserVisited),
      otherUser: getDifference(otherUserVisited, currentUserVisited),
    },
    wantToVisit: {
      shared: getIntersection(currentUserWantToVisit, otherUserWantToVisit),
      currentUser: getDifference(currentUserWantToVisit, otherUserWantToVisit),
      otherUser: getDifference(otherUserWantToVisit, currentUserWantToVisit),
    },
  };
}
