import {
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getDocData, getPaths } from "@lib/firebase";

export type TrackingField = "visitedCountryCodes" | "wantToVisitCountryCodes";

interface TrackingData {
  visitedCountryCodes: string[];
  wantToVisitCountryCodes: string[];
}

/**
 * Service for managing tracking countries of users.
 */
export const countryTrackingService = {
  /**
   * Gets tracking country codes for a user.
   * @param uid - The user ID.
   * @param field - The tracking field to retrieve (visited or want-to-visit list).
   * @returns A promise resolving to an array of tracking country ISO codes.
   */
  async getCountryCodes(uid: string, field: TrackingField): Promise<string[]> {
    const data = await getDocData<TrackingData>(getPaths.user(uid));
    return data && Array.isArray(data[field]) ? data[field] : [];
  },

  /**
   * Subscribe to tracking data changes for a user.
   * @param uid - The user ID.
   * @param cb - Callback receiving the tracking data whenever it changes.
   * @returns An unsubscribe function to stop listening.
   */
  onTrackingDataChange(uid: string, cb: (data: TrackingData) => void) {
    return onSnapshot(getPaths.user(uid), (snap) => {
      const data = snap.data() as TrackingData | undefined;
      cb({
        visitedCountryCodes: Array.isArray(data?.visitedCountryCodes)
          ? data!.visitedCountryCodes
          : [],
        wantToVisitCountryCodes: Array.isArray(data?.wantToVisitCountryCodes)
          ? data!.wantToVisitCountryCodes
          : [],
      });
    });
  },

  /**
   * Adds a country code to the tracking list for a user.
   * @param uid - The user ID.
   * @param code - The country ISO code to add.
   * @param targetField - The tracking field to modify (visited or want-to-visit list).
   */
  async addCountryCode(uid: string, code: string, targetField: TrackingField) {
    const opposingField: TrackingField =
      targetField === "visitedCountryCodes"
        ? "wantToVisitCountryCodes"
        : "visitedCountryCodes";

    await updateDoc(getPaths.user(uid), {
      [targetField]: arrayUnion(code),
      [opposingField]: arrayRemove(code),
    });
  },

  /**
   * Removes a country code from the tracking list for a user.
   * @param uid - The user ID.
   * @param code - The country ISO code to remove.
   * @param field - The tracking field to modify.
   */
  async removeCountryCode(uid: string, code: string, field: TrackingField) {
    await updateDoc(getPaths.user(uid), {
      [field]: arrayRemove(code),
    });
  },
};
