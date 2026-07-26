import type { FriendProfile } from "../types";

/**
 * Filters the given list of friend profiles based on the search query.
 * @param friendProfiles - An array of FriendProfile objects.
 * @param search - The search query string to filter the friend profiles.
 * @returns A filtered array of friend profiles that match the search query in either username or display name.
 */
export function useFriendSearch(
  friendProfiles: FriendProfile[],
  search: string,
) {
  const q = search.toLowerCase();
  return friendProfiles.filter(
    (profile) =>
      profile.username.toLowerCase().includes(q) ||
      profile.displayName.toLowerCase().includes(q),
  );
}
