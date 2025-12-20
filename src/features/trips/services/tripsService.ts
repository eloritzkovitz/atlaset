import type { Trip } from "@types";
import { appDb } from "@utils/db";
import {
  isAuthenticated,
  getUserCollection,
  logUserActivity,
  getCurrentUser,
} from "@utils/firebase";
import { doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

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

  // Bulk save trips (replace all)
  async save(trips: Trip[]) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const tripsCol = getUserCollection("trips");
      for (const trip of trips) {
        await setDoc(doc(tripsCol, trip.id), trip);
      }
      await logUserActivity(
        "save_trips",
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

  // Add a new trip
  async add(trip: Trip) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const tripsCol = getUserCollection("trips");
      await setDoc(doc(tripsCol, trip.id), trip);
      await logUserActivity(
        "add_trip",
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

  // Update only the favorite status of a trip
  async updateFavorite(tripId: string, favorite: boolean) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const tripsCol = getUserCollection("trips");
      const tripRef = doc(tripsCol, tripId);
      await setDoc(tripRef, { favorite }, { merge: true });
      await logUserActivity(
        "update_trip_favorite",
        {
          tripId,
          favorite,
          userName: user!.displayName,
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

  // Update only the rating of a trip
  async updateRating(tripId: string, rating: number | undefined) {
    const ratingValue = rating === undefined ? null : rating;
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const tripsCol = getUserCollection("trips");
      const tripRef = doc(tripsCol, tripId);
      await setDoc(tripRef, { rating: ratingValue }, { merge: true });
      await logUserActivity(
        "update_trip_rating",
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

  // Edits an existing trip
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
        "edit_trip",
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

  // Remove a trip by id
  async remove(id: string) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const tripsCol = getUserCollection("trips");
      const snapshot = await getDocs(tripsCol);
      const tripDoc = snapshot.docs.find((docSnap) => docSnap.id === id);
      const tripName = tripDoc ? tripDoc.data().name : undefined;
      await deleteDoc(doc(tripsCol, id));
      await logUserActivity(
        "remove_trip",
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
