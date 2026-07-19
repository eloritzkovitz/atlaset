import {
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  startAfter,
  query,
  QueryDocumentSnapshot,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";
import { getUserCollection, isAuthenticated } from "@lib/firebase";
import type { UserActivity } from "../types";

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
    const constraints: QueryConstraint[] = [orderBy("timestamp", "desc")];

    if (after) {
      constraints.push(startAfter(after));
    }
    constraints.push(limit(limitCount));

    const q = query(activityCol, ...constraints);
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
    await deleteDoc(doc(getUserCollection("activity"), id));
  },
};
