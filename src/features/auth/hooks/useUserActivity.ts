import { useEffect, useState } from "react";
import { getUserCollection } from "@utils/firebase";
import { query, orderBy, getDocs } from "firebase/firestore";

/**
 * Fetches and returns user activity data.
 * @param userId The ID of the user whose activity is to be fetched.
 * @returns An object containing the activity data and loading state.
 */
export function useUserActivity(userId: string | undefined) {
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user activity when userId changes
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const fetchActivity = async () => {
      const activityCol = getUserCollection("activity");
      const q = query(activityCol, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      setActivity(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchActivity();
  }, [userId]);

  return { activity, loading };
}
