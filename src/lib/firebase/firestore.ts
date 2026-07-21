/**
 * Utility functions for interacting with Firestore.
 */

import {
  collection,
  CollectionReference,
  DocumentReference,
  getDoc,
  getDocs,
  Query,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@app/firebase";
import { getCurrentUser } from "./auth";

/**
 * Gets a typed Firestore collection reference.
 * @param path The path to the collection.
 * @returns The Firestore collection reference cast to the specified type T.
 */
export function getCollection<T>(path: string): CollectionReference<T> {
  return collection(db, path) as CollectionReference<T>;
}

/**
 * Gets a Firestore collection reference for a user's subcollection.
 * @param path The path within the user's collection.
 * @returns The Firestore collection reference for the user's subcollection at the specified path.
 */
export function getUserCollection<T>(path: string): CollectionReference<T> {
  const user = getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  return collection(db, "users", user.uid, path) as CollectionReference<T>;
}

/**
 * Fetches the data of a Firestore document reference and returns it as a typed object.
 * @param ref - The Firestore document reference to fetch data from.
 * @returns A Promise that resolves to the document data as type T, or null if the document does not exist.
 */
export async function getDocData<T>(
  ref: DocumentReference<DocumentData>,
): Promise<T | null> {
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as T) : null;
}

/**
 * Fetches the data of all documents in a Firestore query and returns them as an array of typed objects.
 * @param query - The Firestore query to fetch documents from.
 * @returns A Promise that resolves to an array of document data as type T.
 */
export async function getDocsData<T = DocumentData>(
  ref: CollectionReference<T> | Query<T>,
): Promise<(T & { id: string })[]> {
  const query = ref as Query<T>;
  const snapshot = await getDocs(query);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (T & { id: string })[];
}
