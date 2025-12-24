import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  startAt,
  endAt,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../../firebase";

/**
 * Searches users by username or display name.
 * @param searchTerm - The term to search for.
 * @returns Search results and loading state.
 */
export function useUserSearch(searchTerm: string) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Perform search when searchTerm changes
  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }
    setLoading(true);

    const usersRef = collection(db, "users");
    const usernameQ = query(
      usersRef,
      orderBy("username"),
      startAt(searchTerm.toLowerCase()),
      endAt(searchTerm.toLowerCase() + "\uf8ff")
    );
    const displayNameQ = query(
      usersRef,
      orderBy("displayName"),
      startAt(searchTerm),
      endAt(searchTerm + "\uf8ff")
    );

    // Fetch both username and displayName matches
    Promise.all([getDocs(usernameQ), getDocs(displayNameQ)]).then(
      ([usernameSnap, displayNameSnap]) => {
        // Merge and deduplicate by user id
        const users = [
          ...usernameSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          ...displayNameSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ];
        const uniqueUsers = Array.from(
          new Map(users.map((u) => [u.id, u])).values()
        );
        setResults(uniqueUsers);
        setLoading(false);
      }
    );
  }, [searchTerm]);

  return { results, loading };
}
