import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@app/firebase";

/**
 * Service for managing visited countries of users.
 */
export const visitedCountriesService = {
  /**
   * Gets visited country codes for a user.
   * @param uid - The user ID.
   * @returns A promise resolving to an array of visited country ISO codes.
   */
  async getVisitedCountryCodes(uid: string): Promise<string[]> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() &&
      Array.isArray(userSnap.data().visitedCountryCodes)
      ? userSnap.data().visitedCountryCodes
      : [];
  },

  /**
   * Subscribe to visited country codes changes for a user.
   * @param uid - The user ID.
   * @param cb - Callback receiving the array of codes whenever it changes.
   * @returns An unsubscribe function to stop listening.
   */
  onVisitedCountryCodesChange(uid: string, cb: (codes: string[]) => void) {
    const userRef = doc(db, "users", uid);
    const unsub = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) {
        cb([]);
        return;
      }
      const data = snap.data();
      const codes = Array.isArray(data.visitedCountryCodes)
        ? data.visitedCountryCodes
        : [];
      cb(codes);
    });
    return unsub;
  },

  /**
   * Adds a country code to the visited list for a user.
   * @param uid - The user ID.
   * @param code - The country ISO code to add.
   */
  async addVisitedCountryCode(uid: string, code: string) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      visitedCountryCodes: arrayUnion(code),
    });
  },

  /**
   * Removes a country code from the visited list for a user.
   * @param uid - The user ID.
   * @param code - The country ISO code to remove.
   */
  async removeVisitedCountryCode(uid: string, code: string) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      visitedCountryCodes: arrayRemove(code),
    });
  },
};
