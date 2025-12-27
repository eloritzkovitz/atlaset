import { useEffect, useState } from "react";
import { friendService } from "../services/friendService";

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
      setStatus("none");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Check if already friends
      const friends = await friendService.getFriends(currentUserId);
      if (friends.some((f) => f.uid === profileUserId)) {
        setStatus("friend");
        setLoading(false);
        return;
      }

      // Check if there is a pending outgoing friend request from current user to profile user
      const outgoingRequest = await friendService.getOutgoingFriendRequest(
        profileUserId,
        currentUserId
      );

      if (outgoingRequest) {
        setStatus("pending");
        setLoading(false);
        return;
      }
      setStatus("none");
      setLoading(false);
    } catch (error) {
      setStatus("none");
      setLoading(false);
      console.error("[FriendshipStatus] error:", error);
    }
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
