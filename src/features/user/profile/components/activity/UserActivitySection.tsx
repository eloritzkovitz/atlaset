import { query, orderBy, getDocs, limit, startAfter } from "firebase/firestore";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@contexts/AuthContext";
import { getUserCollection } from "@utils/firebase";
import { UserActivityItem } from "./UserActivityItem";

const PAGE_SIZE = 10;

export function UserActivitySection() {
  const { user } = useAuth();
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Initial load
  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    const fetchInitial = async () => {
      const activityCol = getUserCollection("activity");
      const q = query(
        activityCol,
        orderBy("timestamp", "desc"),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(q);
      setActivity(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
      setLoading(false);
    };
    fetchInitial();
  }, [user?.uid]);

  // Load more handler
  const loadMore = useCallback(async () => {
    if (!user?.uid || !lastDoc || loading || !hasMore) return;
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
      ...snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    ]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setHasMore(snapshot.docs.length === PAGE_SIZE);
    setLoading(false);
  }, [user?.uid, lastDoc, loading, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMore, hasMore, loading]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Activity</h3>
      {loading && activity.length === 0 ? (
        <div className="text-gray-400">Loading...</div>
      ) : activity.length === 0 ? (
        <div className="text-gray-400">No activity yet.</div>
      ) : (
        <>
          <ul className="space-y-4">
            {activity.map((act) => (
              <UserActivityItem key={act.id} act={act} />
            ))}
          </ul>
          <div ref={loaderRef} />
          {loading && (
            <div className="flex justify-center mt-4">
              <span className="text-gray-400">Loading...</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
