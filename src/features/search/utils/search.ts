import type { Friend, SerializableUser, UserProfile } from "@features/user";

/**
 * Determines the label for a user based on their relationship to the current user.
 * @param profile - The user profile to label.
 * @param currentUser - The current logged-in user.
 * @param friendList - The list of friends for the current user.
 * @returns The label for the user.
 */
export function getUserLabel(
  profile: UserProfile,
  currentUser: SerializableUser | null,
  friendList: Friend[],
) {
  if (currentUser && profile.uid === currentUser.uid) {
    return "You";
  } else if (currentUser && friendList.some((f) => f.uid === profile.uid)) {
    return "Friend";
  }
  return "";
}

/**
 * Ranks items by whether their label starts with or contains the search term.
 * Items whose label starts with the search term are ranked higher than those that only contain it.
 * @param items - The array of items to rank.
 * @param getLabel - A function that returns the label for an item.
 * @param searchTerm - The term to search for.
 * @returns A new array of items ranked by relevance to the search term.
 */
export function rankByStartsWithAndContains<T>(
  items: T[],
  getLabel: (item: T) => string | undefined,
  searchTerm: string,
): T[] {
  const lowerTerm = searchTerm.toLowerCase();
  const startsWith = items.filter((item) =>
    getLabel(item)?.toLowerCase().startsWith(lowerTerm),
  );
  const contains = items.filter(
    (item) =>
      !getLabel(item)?.toLowerCase().startsWith(lowerTerm) &&
      getLabel(item)?.toLowerCase().includes(lowerTerm),
  );
  return [...startsWith, ...contains];
}
