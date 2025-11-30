import type { Trip } from "@types";
import { appDb } from "@utils/db";
import { isAuthenticated, getUserCollection } from "@utils/firebase";
import {
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export const tripsService = {
  // Load all trips
  async load(): Promise<Trip[]> {
    if (isAuthenticated()) {
      const tripsCol = getUserCollection("trips");
      const snapshot = await getDocs(tripsCol);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Trip)
      );
    } else {
      return await appDb.trips.toArray();
    }
  },

  // Add a new trip
  async add(trip: Trip) {
    if (isAuthenticated()) {
      const tripsCol = getUserCollection("trips");
      await setDoc(doc(tripsCol, trip.id), trip);
    } else {
      await appDb.trips.add(trip);
    }
  },

  // Update an existing trip
  async update(trip: Trip) {
    if (isAuthenticated()) {
      const tripsCol = getUserCollection("trips");
      await setDoc(doc(tripsCol, trip.id), trip);
    } else {
      await appDb.trips.put(trip);
    }
  },

  // Remove a trip by id
  async remove(id: string) {
    if (isAuthenticated()) {
      const tripsCol = getUserCollection("trips");
      await deleteDoc(doc(tripsCol, id));
    } else {
      await appDb.trips.delete(id);
    }
  },
};
