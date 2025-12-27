import { useEffect, useState } from "react";
import { friendService } from "../services/friendService";
import type { FriendRequest } from "../../types";

/**
 * Fetches and manages friend requests for a user.
 * @param userId - The user ID to fetch friend requests for.
 * @returns An object containing the friend requests and loading state.
 */
export function useFriendRequests(userId?: string) {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Listen for friend requests in real-time when userId changes
  useEffect(() => {
    if (!userId) {
      setRequests([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = friendService.listenForFriendRequests(
      userId,
      (reqs) => {
        setRequests(reqs);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  return { requests, loading };
}
