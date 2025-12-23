import { db } from "../../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

/**
 * Fetches and manages a Firestore username.
 * @param uid - The user ID to fetch the username for.
 * @returns An object containing the username, loading state, and any error encountered.
 */
export function useFirestoreUsername(uid?: string | null) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch username when uid changes
  useEffect(() => {
    if (!uid) {
      setUsername("");
      return;
    }
    setLoading(true);
    setError(null);
    const fetchUsername = async () => {
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        setUsername(userSnap.exists() ? userSnap.data().username || "" : "");
      } catch {
        setError("Failed to fetch username");
        setUsername("");
      } finally {
        setLoading(false);
      }
    };
    fetchUsername();
  }, [uid]);

  return { username, loading, error };
}
