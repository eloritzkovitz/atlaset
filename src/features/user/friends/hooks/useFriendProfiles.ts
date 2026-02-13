import { useEffect, useState } from "react";
import { profileService } from "../../profile/services/profileService";
import type { UserProfile } from "../../types";

/**
 * Fetches full user profiles for a list of friend UIDs.
 * @param friendUids Array of friend UIDs
 * @returns An object containing the list of user profiles and loading state.
 */
export function useFriendProfiles(friendUids: string[]) {
  const [friendProfiles, setFriendProfiles] = useState<UserProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  // Fetch profiles when friendUids changes
  useEffect(() => {
    let cancelled = false;
    async function fetchProfiles() {
      setLoadingProfiles(true);
      const profiles: UserProfile[] = [];
      for (const uid of friendUids) {
        const profile = await profileService.getUserProfileByUid(uid);
        if (profile) profiles.push(profile);
      }
      if (!cancelled) {
        setFriendProfiles(profiles);
        setLoadingProfiles(false);
      }
    }
    if (friendUids.length > 0) {
      fetchProfiles();
    } else {
      setFriendProfiles([]);
      setLoadingProfiles(false);
    }
    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(friendUids)]);

  return { profiles: friendProfiles, loading: loadingProfiles };
}
