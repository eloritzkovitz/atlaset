import { useEffect, useState } from "react";
import {
  getFriends,
  getOutgoingFriendRequest,
} from "../services/friendService";

/**
 * Friendship status between current user and profile user.
 * @returns { status, loading, refresh }
 * - status: "none" | "pending" | "friend"
 * - loading: boolean
 * - refresh: function to re-check status
 */
export function useFriendshipStatus(
  currentUserId: string | undefined,
  profileUserId: string | undefined
) {
  const [status, setStatus] = useState<"none" | "pending" | "friend">("none");
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!currentUserId || !profileUserId || currentUserId === profileUserId) {
      return;
    }
    setLoading(true);
    // Check if already friends
    const friends = await getFriends(currentUserId);
    if (friends.some((f) => f.uid === profileUserId)) {
      setStatus("friend");
      setLoading(false);
      return;
    }

    // Check if there is a pending outgoing friend request from current user to profile user
    const outgoingRequest = await getOutgoingFriendRequest(
      profileUserId,
      currentUserId
    );

    // If an outgoing request exists, set status to "pending"
    if (outgoingRequest) {
      setStatus("pending");
      setLoading(false);
      return;
    }
    setStatus("none");
    setLoading(false);
  };

  // Initial check and on dependency changes
  useEffect(() => {
    async function run() {
      await checkStatus();
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, profileUserId]);

  return { status, loading, refresh: checkStatus };
}
