import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
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
   * Sets visited country codes for a user.
   * @param uid - The user ID.
   * @param codes - An array of country ISO codes to set as visited.
   */
  async setVisitedCountryCodes(uid: string, codes: string[]) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { visitedCountryCodes: codes });
  },
};
