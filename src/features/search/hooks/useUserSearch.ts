import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  startAt,
  endAt,
  getDocs,
} from "firebase/firestore";
import type { UserProfile } from "@features/user/profile/types";
import { db } from "@lib/firebase";
import type { UserSearchResult } from "../types";

/**
 * Searches users by username or display name.
 * @param searchTerm - The term to search for.
 * @param currentUserId - The current user's UID.
 * @param friendIds - Array of friend UIDs.
 * @returns Search results and loading state.
 */
export function useUserSearch(
  searchTerm: string,
  currentUserId: string | null | undefined,
  friendIds: string[],
) {
  const [results, setResults] = useState<UserSearchResult[]>([]);
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
      endAt(searchTerm.toLowerCase() + "\uf8ff"),
    );
    const displayNameQ = query(
      usersRef,
      orderBy("displayName"),
      startAt(searchTerm),
      endAt(searchTerm + "\uf8ff"),
    );

    // Fetch both username and displayName matches
    Promise.all([getDocs(usernameQ), getDocs(displayNameQ)])
      .then(([usernameSnap, displayNameSnap]) => {
        const users = [
          ...usernameSnap.docs.map((doc) => ({
            uid: doc.id,
            ...(doc.data() as Omit<UserProfile, "uid">),
          })),
          ...displayNameSnap.docs.map((doc) => ({
            uid: doc.id,
            ...(doc.data() as Omit<UserProfile, "uid">),
          })),
        ];

        const uniqueUsers: UserSearchResult[] = Array.from(
          new Map(users.map((u) => [u.uid, u])).values(),
        )
          .filter((u) => u.isSearchIndexingAllowed !== false)
          .map((u) => ({
            ...u,
            isCurrentUser: currentUserId ? u.uid === currentUserId : false,
            isFriend: friendIds.includes(u.uid),
            type: "user",
          }));

        setResults(uniqueUsers);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchTerm, currentUserId, friendIds]);

  return { results, loading };
}
