import { useState, useEffect, useCallback } from "react";
import {
  query,
  getDocs,
  limit,
  startAfter,
  CollectionReference,
  QueryConstraint,
  type DocumentData,
  QuerySnapshot,
} from "firebase/firestore";

// Type for Firestore usage
interface FirestorePaginationOptions {
  collection: CollectionReference<DocumentData>;
  constraints?: QueryConstraint[];
  pageSize?: number;
  mode: "firestore";
}

// Type for local array usage
interface LocalPaginationOptions<T> {
  items: T[];
  pageSize?: number;
  mode: "local";
}

type UsePaginationOptions<T> =
  | FirestorePaginationOptions
  | LocalPaginationOptions<T>;

/**
 * Paginates data either from a local array or a Firestore collection.
 * @param options - Configuration options for pagination.
 * @returns An object containing paginated data, loading state, pagination info, and a function to load more data.
 */
export function usePagination<T = any>(options: UsePaginationOptions<T>) {
  const pageSize = options.pageSize ?? 20;

  // Local array pagination
  if (options.mode === "local") {
    const [page, setPage] = useState(1);
    const paginated = options.items.slice(0, page * pageSize);
    const hasMore = paginated.length < options.items.length;
    const loading = false;

    const loadMore = useCallback(() => {
      if (hasMore) setPage((p) => p + 1);
    }, [hasMore]);

    return { data: paginated, loading, hasMore, loadMore, page };
  }

  // Firestore pagination
  const { collection, constraints = [], mode } = options;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(false);

  // Initial load
  useEffect(() => {
    if (mode !== "firestore") return;
    setLoading(true);
    const fetchInitial = async () => {
      const q = query(collection, ...constraints, limit(pageSize));
      const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);
      setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T)));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === pageSize);
      setLoading(false);
    };
    fetchInitial();
    // eslint-disable-next-line
  }, [collection, JSON.stringify(constraints), pageSize, mode]);

  // Load more handler
  const loadMore = useCallback(async () => {
    if (mode !== "firestore" || !lastDoc || loading || !hasMore) return;
    setLoading(true);
    const q = query(
      collection,
      ...constraints,
      startAfter(lastDoc),
      limit(pageSize)
    );
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    setData((prev) => [
      ...prev,
      ...snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T)),
    ]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setHasMore(snapshot.docs.length === pageSize);
    setLoading(false);
  }, [collection, constraints, lastDoc, loading, hasMore, pageSize, mode]);

  return { data, loading, hasMore, loadMore };
}
