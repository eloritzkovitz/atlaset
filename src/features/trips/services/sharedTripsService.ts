import { getFirestore, collection, getDocs } from "firebase/firestore";

/**
 * Fetch all shared trip IDs for a given user from the 'sharedtrips' collection.
 * Each document should have a 'userId' and a 'tripId' field.
 */
export async function getSharedTripIds(userId: string): Promise<string[]> {
  const db = getFirestore();
  const q = collection(db, "users", userId, "sharedTrips");
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.id);
}
