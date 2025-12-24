import { useEffect, useState } from "react";
import { getFriends, getFriendRequests } from "@features/user/friends/services/friendService";

/**
 * Friendship status between current user and profile user.
 * @returns { status, loading, refresh }
 * - status: "none" | "pending" | "friend"
 * - loading: boolean
 * - refresh: function to re-check status
 */
export function useFriendshipStatus(currentUserId: string | undefined, profileUserId: string | undefined) {
  const [status, setStatus] = useState<"none" | "pending" | "friend">("none");
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!currentUserId || !profileUserId || currentUserId === profileUserId) return;
    let mounted = true;
    setLoading(true);
    // Check if already friends
    const friends = await getFriends(currentUserId);
    if (friends.some((f) => f.uid === profileUserId)) {
      if (mounted) setStatus("friend");
      setLoading(false);
      return;
    }
    // Only check friend requests if viewing own profile
    let pending = false;
    if (profileUserId === currentUserId) {
      const requests = await getFriendRequests(currentUserId);
      pending = requests.some(
        (r) => r.from === currentUserId && r.to === profileUserId
      );
    }
    if (pending) {
      if (mounted) setStatus("pending");
      setLoading(false);
      return;
    }
    if (mounted) setStatus("none");
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    async function run() {
      await checkStatus();
    }
    run();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, profileUserId]);

  return { status, loading, refresh: checkStatus };
}
