import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { isAuthenticated, getCurrentUser } from "@utils/firebase";
import type { CountryList } from "../types";
import { db } from "../../../firebase";

/**
 * Service for managing user country lists.
 */
export const countryListService = {
  /**
   * Loads all country lists for the current user.
   * @returns A promise that resolves to an array of CountryList.
   */
  async load(): Promise<CountryList[]> {
    if (!isAuthenticated()) return [];
    const user = getCurrentUser();
    const listsCol = collection(db, "users", user!.uid, "countryLists");
    const snapshot = await getDocs(listsCol);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as CountryList,
    );
  },

  /**
   * Creates or updates a country list for the current user.
   * @param list - The CountryList to save.
   */
  async save(list: CountryList) {
    if (!isAuthenticated()) return;
    const user = getCurrentUser();
    const listRef = doc(db, "users", user!.uid, "countryLists", list.id);
    await setDoc(listRef, list);
  },

  /**
   * Deletes a country list for the current user.
   * @param id - The id of the CountryList to delete.
   */
  async delete(id: string) {
    if (!isAuthenticated()) return;
    const user = getCurrentUser();
    const listRef = doc(db, "users", user!.uid, "countryLists", id);
    await deleteDoc(listRef);
  },
};
