import { useMemo } from "react";
import { useUserFriends } from "./useUserFriends";

/**
 * Fetches the mutual friends between the current user and a target user.
 * @param currentUid The UID of the current user.
 * @param targetUid The UID of the target user.
 * @returns An object containing mutual friends, their UIDs, count, loading state, and any error encountered.
 */
export function useMutualFriends(
  currentUid: string | undefined,
  targetUid: string | undefined,
) {
  const {
    friendUids: myUids,
    loading: myLoading,
    error: myError,
  } = useUserFriends(currentUid);

  const {
    friends: targetFriends,
    loading: targetLoading,
    error: targetError,
  } = useUserFriends(targetUid);

  const { mutualFriends, mutualUids } = useMemo(() => {
    if (!currentUid || !targetUid || currentUid === targetUid) {
      return { mutualFriends: [], mutualUids: [] };
    }

    const mySet = new Set(myUids);
    const mutual = targetFriends.filter((f) => mySet.has(f.uid));
    const uids = mutual.map((f) => f.uid);

    return { mutualFriends: mutual, mutualUids: uids };
  }, [currentUid, targetUid, myUids, targetFriends]);

  return {
    mutualFriends,
    mutualUids,
    mutualCount: mutualUids.length,
    loading: myLoading || targetLoading,
    error: myError || targetError,
  };
}
