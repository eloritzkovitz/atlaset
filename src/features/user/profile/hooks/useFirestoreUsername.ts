import { useEffect, useState } from "react";
import { getDocData, getPaths } from "@lib/firebase";
import type { FirestoreUser } from "../../types";

/**
 * Fetches and manages a Firestore username.
 * @param uid - The user ID to fetch the username for.
 * @returns An object containing the username, loading state, and any error encountered.
 */
export function useFirestoreUsername(uid?: string | null) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setUsername("");
      return;
    }

    setLoading(true);
    setError(null);

    const fetchUsername = async () => {
      try {
        const userRef = getPaths.user(uid);
        const userData = await getDocData<FirestoreUser>(userRef);

        setUsername(userData?.username || "");
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
