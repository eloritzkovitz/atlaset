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
