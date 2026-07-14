import { useState, useEffect, useCallback } from "react";
import { QueryDocumentSnapshot, type DocumentData } from "firebase/firestore";
import { activityService } from "../services/activityService";
import type { UserActivity } from "../types";

/**
 * Fetches and manages user activity data.
 * @param userId - The ID of the user whose activity is to be fetched.
 * @returns An object containing the activity data, loading state, pagination info, and a function to load more data.
 */
export function useUserActivity() {
  const [activity, setActivity] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | Error | null>(null);

  // Initial load
  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchInitial = async () => {
      try {
        const { activities, lastDoc, pageSize } =
          await activityService.fetchActivityPage({ limitCount: 10 });
        setActivity(activities);
        setLastDoc(lastDoc);
        setHasMore(pageSize === 10);
      } catch (err) {
        setError(err instanceof Error ? err : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  // Load more handler
  const loadMore = useCallback(async () => {
    if (!lastDoc || loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const {
        activities,
        lastDoc: newLastDoc,
        pageSize,
      } = await activityService.fetchActivityPage({
        after: lastDoc,
        limitCount: 10,
      });
      setActivity((prev) => [...prev, ...activities]);
      setLastDoc(newLastDoc);
      setHasMore(pageSize === 10);
    } catch (err) {
      setError(err instanceof Error ? err : String(err));
    } finally {
      setLoading(false);
    }
  }, [lastDoc, loading, hasMore]);

  // Delete activity item by id
  const deleteActivity = useCallback(async (id: string) => {
    try {
      await activityService.deleteActivityById(id);
      setActivity((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : String(err));
    }
  }, []);

  return { activity, loading, hasMore, loadMore, deleteActivity, error };
}
