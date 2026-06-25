import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@app/firebase";

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
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return [];

    const data = userSnap.data();
    return Array.isArray(data[field]) ? data[field] : [];
  },

  /**
   * Subscribe to tracking data changes for a user.
   * @param uid - The user ID.
   * @param cb - Callback receiving the tracking data whenever it changes.
   * @returns An unsubscribe function to stop listening.
   */
  onTrackingDataChange(uid: string, cb: (data: TrackingData) => void) {
    const userRef = doc(db, "users", uid);

    return onSnapshot(userRef, (snap) => {
      if (!snap.exists()) {
        cb({ visitedCountryCodes: [], wantToVisitCountryCodes: [] });
        return;
      }

      const data = snap.data();
      cb({
        visitedCountryCodes: Array.isArray(data.visitedCountryCodes)
          ? data.visitedCountryCodes
          : [],
        wantToVisitCountryCodes: Array.isArray(data.wantToVisitCountryCodes)
          ? data.wantToVisitCountryCodes
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
    const userRef = doc(db, "users", uid);
    const opposingField: TrackingField =
      targetField === "visitedCountryCodes"
        ? "wantToVisitCountryCodes"
        : "visitedCountryCodes";

    await updateDoc(userRef, {
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
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      [field]: arrayRemove(code),
    });
  },
};
