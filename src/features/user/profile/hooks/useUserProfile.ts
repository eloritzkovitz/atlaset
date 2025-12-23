import { useEffect, useState } from "react";
import {
  getUserProfileByUid,
  getUserProfileByUsername,
} from "../services/profileService";
import type { UserProfile } from "../../types";

/**
 * Manages fetching user profile by uid or username.
 * @param uid - The user ID to fetch profile for.
 * @param username - The username to fetch profile for.
 * @returns An object containing the user profile and loading state.
 */
export function useUserProfile({
  uid,
  username,
}: {
  uid?: string;
  username?: string;
}) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile when uid or username changes
  useEffect(() => {
    setProfile(null);
    // If uid is provided, fetch by uid; else if username is provided, fetch by username
    if (uid) {
      setLoading(true);
      getUserProfileByUid(uid)
        .then(setProfile)
        .finally(() => setLoading(false));
    } else if (username) {
      setLoading(true);
      getUserProfileByUsername(username)
        .then(setProfile)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [uid, username]);

  return { profile, loading };
}
