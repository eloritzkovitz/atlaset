import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@app/firebase";

/** Service for managing shared trips. */
export const sharedTripsService = {
  /** Fetch all shared trip IDs for a user */
  async getSharedTripIds(userId: string): Promise<string[]> {
    const q = collection(db, "users", userId, "sharedTrips");
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.id);
  },

  /** Add a reference for a participant */
  async addReference(participantUid: string, ownerUid: string, tripId: string) {
    const sharedRefDoc = doc(
      collection(db, `users/${participantUid}/sharedTrips`),
      tripId,
    );
    await setDoc(sharedRefDoc, { ownerUid, tripId });
  },

  /** Remove a reference for a participant */
  async removeReference(participantUid: string, tripId: string) {
    const sharedRefDoc = doc(
      collection(db, `users/${participantUid}/sharedTrips`),
      tripId,
    );
    await deleteDoc(sharedRefDoc);
  },
};
