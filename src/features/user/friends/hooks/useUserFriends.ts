import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@firebase";
import { getCurrentUser } from "@utils/firebase";
import type { Friend } from "../../types";

/**
 * Fetches the friends list for any user by uid, with real-time updates.
 * If no uid is provided, fetches the current user's friends.
 * @param uid The user ID to fetch friends for (optional).
 * @returns An object containing the friends list, loading state, and any error encountered.
 */
export function useUserFriends(uid?: string) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Listen for friends in real-time when uid changes
  useEffect(() => {
    let resolvedUid = uid;
    if (!resolvedUid) {
      const currentUser = getCurrentUser();
      resolvedUid = currentUser?.uid;
    }
    if (!resolvedUid) {
      setFriends([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const friendsCol = collection(db, `users/${resolvedUid}/friends`);
    const unsubscribe = onSnapshot(
      friendsCol,
      (snap) => {
        const friendsList: Friend[] = snap.docs.map((doc) => {
          const data = doc.data();
          return {
            uid: doc.id,
            createdAt: data.createdAt ?? null,
            ...data,
          };
        });
        setFriends(friendsList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, [uid]);

  return { friends, loading, error };
}
