import { useState, useEffect, useCallback } from "react";
import {
  query,
  orderBy,
  getDocs,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { getUserCollection } from "@utils/firebase";
import type { UserActivity } from "../../types";

const PAGE_SIZE = 10;

/**
 * Fetches and manages user activity data with pagination.
 * @param userId - The ID of the user whose activity is to be fetched.
 * @returns An object containing the activity data, loading state, pagination info, and a function to load more data.
 */
export function useUserActivity(userId?: string) {
  const [activity, setActivity] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Initial load
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const fetchInitial = async () => {
      const activityCol = getUserCollection("activity");
      const q = query(
        activityCol,
        orderBy("timestamp", "desc"),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(q);
      setActivity(
        snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as UserActivity)
        )
      );
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
      setLoading(false);
    };
    fetchInitial();
  }, [userId]);

  // Load more handler
  const loadMore = useCallback(async () => {
    if (!userId || !lastDoc || loading || !hasMore) return;
    setLoading(true);
    const activityCol = getUserCollection("activity");
    const q = query(
      activityCol,
      orderBy("timestamp", "desc"),
      startAfter(lastDoc),
      limit(PAGE_SIZE)
    );
    const snapshot = await getDocs(q);
    setActivity((prev) => [
      ...prev,
      ...snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as UserActivity)
      ),
    ]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setHasMore(snapshot.docs.length === PAGE_SIZE);
    setLoading(false);
  }, [userId, lastDoc, loading, hasMore]);

  return { activity, loading, hasMore, loadMore };
}
