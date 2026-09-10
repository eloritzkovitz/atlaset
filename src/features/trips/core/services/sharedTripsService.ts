import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { getDocsData, getPaths } from "@lib/firebase";
import type { SharedTrip } from "../types";

/** Service for managing shared trips. */
export const sharedTripsService = {
  /** Fetch all shared trip IDs for a user */
  async getSharedTripIds(userId: string): Promise<string[]> {
    const docs = await getDocsData<SharedTrip>(
      getPaths.sub(userId, "sharedTrips"),
    );
    return docs.map((doc) => doc.id);
  },

  /** Add a reference for a participant */
  async addReference(
    participantUid: string,
    ownerUid: string,
    tripId: string,
  ): Promise<void> {
    const sharedRefDoc = doc(
      getPaths.sub(participantUid, "sharedTrips"),
      tripId,
    );
    await setDoc(sharedRefDoc, { ownerUid, tripId });
  },

  /** Remove a reference for a participant */
  async removeReference(participantUid: string, tripId: string): Promise<void> {
    const sharedRefDoc = doc(
      getPaths.sub(participantUid, "sharedTrips"),
      tripId,
    );
    await deleteDoc(sharedRefDoc);
  },
};
