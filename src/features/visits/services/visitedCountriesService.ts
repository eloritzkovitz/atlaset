import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

/**
 * Gets visited country codes for a user.
 * @param uid - The user ID.
 * @returns A promise resolving to an array of visited country ISO codes.
 */
export async function getVisitedCountryCodes(uid: string): Promise<string[]> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() && Array.isArray(userSnap.data().visitedCountryCodes)
    ? userSnap.data().visitedCountryCodes
    : [];
}

/**
 * Sets visited country codes for a user.
 * @param uid - The user ID.
 * @param codes - An array of country ISO codes to set as visited.
 */
export async function setVisitedCountryCodes(uid: string, codes: string[]) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { visitedCountryCodes: codes });
}
