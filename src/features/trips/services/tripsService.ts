import { doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { logUserActivity } from "../../../features/user";
import { appDb } from "@utils/db";
import {
  isAuthenticated,
  getUserCollection,
  getCurrentUser,
} from "@utils/firebase";
import type { Trip } from "../types";

/**
 * Service for managing user trips.
 */
export const tripsService = {
  /**
   * Loads user trips for the current user.
   * @returns - An array of trip objects. 
   */
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

  /**
   * Saves multiple trips.
   * @param trips - The array of trip objects to save.
   */
  async save(trips: Trip[]) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const tripsCol = getUserCollection("trips");
      for (const trip of trips) {
        await setDoc(doc(tripsCol, trip.id), trip);
      }
      await logUserActivity(
        410,
        {
          count: trips.length,
          userName: user!.displayName,
        },
        user!.uid
      );
    } else {
      await appDb.trips.clear();
      if (trips.length > 0) {
        await appDb.trips.bulkAdd(trips);
      }
    }
  },

  /**
   * Add a new trip.
   * @param trip - The trip object to add.
   */
  async add(trip: Trip) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const tripsCol = getUserCollection("trips");
      await setDoc(doc(tripsCol, trip.id), trip);
      await logUserActivity(
        411,
        {
          tripId: trip.id,
          itemName: trip.name,
          userName: user!.displayName,
        },
        user!.uid
      );
    } else {
      await appDb.trips.add(trip);
    }
  },

  /**
   * Update the favorite status of a trip.
   * @param tripId - The ID of the trip to update.
   * @param favorite - The new favorite status.
   */
  async updateFavorite(tripId: string, favorite: boolean) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const tripsCol = getUserCollection("trips");
      const tripRef = doc(tripsCol, tripId);
      await setDoc(tripRef, { favorite }, { merge: true });
      await logUserActivity(
        413,
        {
          tripId,
          userName: user!.displayName,
          favorite,
          action: favorite ? "favorited" : "unfavorited",
        },
        user!.uid
      );
    } else {
      const trip = await appDb.trips.get(tripId);
      if (trip) {
        await appDb.trips.put({ ...trip, favorite });
      }
    }
  },

  /**
   * Update the rating of a trip.
   * @param tripId - The ID of the trip to update.
   * @param rating - The new rating value.
   */
  async updateRating(tripId: string, rating: number | undefined) {
    const ratingValue = rating === undefined ? null : rating;
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const tripsCol = getUserCollection("trips");
      const tripRef = doc(tripsCol, tripId);
      await setDoc(tripRef, { rating: ratingValue }, { merge: true });
      await logUserActivity(
        414,
        {
          tripId,
          rating: ratingValue,
          userName: user!.displayName,
        },
        user!.uid
      );
    } else {
      const trip = await appDb.trips.get(tripId);
      if (trip) {
        await appDb.trips.put({ ...trip, rating: ratingValue });
      }
    }
  },

  /**
   * Edits an existing trip.
   * @param trip - The trip object with updated data.
   */
  async edit(trip: Trip) {
    // Prepare Firestore object with nulls for undefined dates
    const tripForFirestore = {
      ...trip,
      startDate: trip.startDate === undefined ? null : trip.startDate,
      endDate: trip.endDate === undefined ? null : trip.endDate,
    };

    if (isAuthenticated()) {
      const user = getCurrentUser();
      const tripsCol = getUserCollection("trips");
      await setDoc(
        doc(tripsCol, trip.id),
        tripForFirestore as Record<string, unknown>
      );
      await logUserActivity(
        412,
        {
          tripId: trip.id,
          itemName: trip.name,
          userName: user!.displayName,
        },
        user!.uid
      );
    } else {
      await appDb.trips.put(trip);
    }
  },

  /**
   * Removes a trip by ID.
   * @param id - The ID of the trip to remove.
   */
  async remove(id: string) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const tripsCol = getUserCollection("trips");
      const snapshot = await getDocs(tripsCol);
      const tripDoc = snapshot.docs.find((docSnap) => docSnap.id === id);
      const tripName = tripDoc ? tripDoc.data().name : undefined;
      await deleteDoc(doc(tripsCol, id));
      await logUserActivity(
        415,
        {
          tripId: id,
          itemName: tripName,
          userName: user!.displayName,
        },
        user!.uid
      );
    } else {
      await appDb.trips.delete(id);
    }
  },
};
