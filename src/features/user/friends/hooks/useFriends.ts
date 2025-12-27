import { useEffect, useState } from "react";
import { getCurrentUser } from "@utils/firebase";
import type { Friend } from "../../types";
import { friendService } from "../services/friendService";

/**
 * Fetches and manages the current user's friends list.
 * @returns An object containing the friends list, loading state, and any error encountered.
 */
export function useFriends() {
  const currentUser = getCurrentUser();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Listen for friends in real-time when currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setFriends([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = friendService.listenForFriends(
      currentUser.uid,
      (friendsList) => {
        setFriends(friendsList);
        setLoading(false);
        setError(null);
      }
    );
    return () => unsubscribe();
  }, [currentUser]);

  return { friends, loading, error };
}
