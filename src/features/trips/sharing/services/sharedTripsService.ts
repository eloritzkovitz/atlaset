import { doc, setDoc, deleteDoc } from "firebase/firestore";
import type { Permission } from "@features/user/permissions/types";
import { getDocsData, getPaths } from "@lib/firebase";
import type { SharedTrip, SharedTripType } from "../types";

/** Service for managing shared trips. */
export const sharedTripsService = {
  /** Fetches all shared trip references for a user. */
  async getSharedTrips(userId: string): Promise<SharedTrip[]> {
    return getDocsData<SharedTrip>(getPaths.sub(userId, "sharedTrips"));
  },

  /** Fetches all shared trip IDs for a user. */
  async getSharedTripIds(userId: string): Promise<string[]> {
    const trips = await this.getSharedTrips(userId);
    return trips.map((trip) => trip.tripId);
  },

  /** Fetches all participant trips for a user. */
  async getParticipantTrips(userId: string): Promise<SharedTrip[]> {
    const trips = await this.getSharedTrips(userId);
    return trips.filter((trip) => trip.type === "participant");
  },

  /** Adds a reference for a recipient. */
  async addReference(
    recipientUid: string,
    ownerUid: string,
    tripId: string,
    type: SharedTripType = "shared",
    permission: Permission = "viewer",
  ): Promise<void> {
    const sharedRefDoc = doc(getPaths.sub(recipientUid, "sharedTrips"), tripId);
    await setDoc(sharedRefDoc, { ownerUid, tripId, type, permission });
  },

  /** Removes a reference for a recipient. */
  async removeReference(recipientUid: string, tripId: string): Promise<void> {
    const sharedRefDoc = doc(getPaths.sub(recipientUid, "sharedTrips"), tripId);
    await deleteDoc(sharedRefDoc);
  },
};
