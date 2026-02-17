import {
  query,
  orderBy,
  getDocs,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  type DocumentData,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { getUserCollection, isAuthenticated } from "@utils/firebase";
import type { UserActivity } from "../../types";

/** Service for managing user activity data. */
export const activityService = {
  /**
   * Fetches a page of user activity data for the current user.
   * @param after - Optional QueryDocumentSnapshot to start after (for pagination)
   * @param limitCount - Optional page size (default 10)
   */
  async fetchActivityPage({
    after,
    limitCount = 10,
  }: {
    after?: QueryDocumentSnapshot<DocumentData> | null;
    limitCount?: number;
  } = {}) {
    if (!isAuthenticated()) throw new Error("Not authenticated");
    const activityCol = getUserCollection("activity");
    let q;
    if (after) {
      q = query(
        activityCol,
        orderBy("timestamp", "desc"),
        startAfter(after),
        limit(limitCount),
      );
    } else {
      q = query(activityCol, orderBy("timestamp", "desc"), limit(limitCount));
    }
    const snapshot = await getDocs(q);
    const activities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      action: doc.data().action,
    })) as UserActivity[];
    return {
      activities,
      lastDoc:
        snapshot.docs.length > 0
          ? (snapshot.docs[
              snapshot.docs.length - 1
            ] as QueryDocumentSnapshot<DocumentData>)
          : null,
      pageSize: activities.length,
    };
  },

  /**
   * Deletes a user activity item by id for the current user.
   * @param id - The ID of the activity item to delete.
   */
  async deleteActivityById(id: string) {
    if (!isAuthenticated()) throw new Error("Not authenticated");
    const activityCol = getUserCollection("activity");
    await deleteDoc(doc(activityCol, id));
  },
};
