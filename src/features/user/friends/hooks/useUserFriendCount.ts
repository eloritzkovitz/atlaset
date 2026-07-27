import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@lib/firebase";

/**
 * Fetches the number of friends for any user by uid, with real-time updates.
 * @param uid The user ID to fetch friend count for.
 * @returns An object containing the friend count, loading state, and any error encountered.
 */
export function useUserFriendCount(uid: string | undefined) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Listen for friend count in real-time when uid changes
  useEffect(() => {
    if (!uid) {
      setCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    const friendsCol = collection(db, `users/${uid}/friends`);
    const unsubscribe = onSnapshot(
      friendsCol,
      (snap) => {
        setCount(snap.size);
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

  return { count, loading, error };
}
