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
  const serializedUids = JSON.stringify(friendUids);
  useEffect(() => {
    let cancelled = false;
    setLoadingProfiles(true);
    async function fetchProfiles() {
      const profiles: UserProfile[] = [];
      // Fetch each profile sequentially
      for (const uid of friendUids) {
        const profile = await profileService.getUserProfileByUid(uid);
        if (profile) profiles.push(profile);
      }

      // Only update state if the component is still mounted
      if (!cancelled) {
        setFriendProfiles(profiles);
        setLoadingProfiles(false);
      }
    }

    // Only fetch if there are friend UIDs to fetch
    if (friendUids.length > 0) {
      fetchProfiles();
    } else {
      setFriendProfiles([]);
      setLoadingProfiles(false);
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedUids]);

  return { profiles: friendProfiles, loading: loadingProfiles };
}
