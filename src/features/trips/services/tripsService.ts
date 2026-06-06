import {
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
  getDoc,
} from "firebase/firestore";
import { db } from "@app/firebase";
import {
  isAuthenticated,
  getUserCollection,
  getCurrentUser,
} from "@utils/firebase";
import type { Trip } from "../types";
import { logUserActivity } from "../../../features/user";
import { profileService } from "../../user/profile/services/profileService";

/**
 * Service for managing user trips.
 */
export const tripsService = {
  /**
   * Loads user trips for the current user.
   * @returns - An array of trip objects.
   */
  async load(): Promise<Trip[]> {
    if (!isAuthenticated())
      throw new Error("Authentication required to load trips.");
    const user = getCurrentUser();
    const tripsCol = getUserCollection("trips");

    // Fetch trips owned by the user
    const ownedSnapshot = await getDocs(tripsCol);
    const ownedTrips = ownedSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Trip,
    );

    // Fetch shared trip references
    const sharedRefsCol = collection(db, `users/${user?.uid}/sharedTrips`);
    const sharedRefsSnap = await getDocs(sharedRefsCol);
    const sharedRefs = sharedRefsSnap.docs.map(
      (doc) => doc.data() as { ownerUid: string; tripId: string },
    );

    // Fetch each shared trip from the owner's collection
    const sharedTrips: Trip[] = [];
    for (const ref of sharedRefs) {
      const ownerTripsCol = collection(db, `users/${ref.ownerUid}/trips`);
      const tripDoc = await getDoc(doc(ownerTripsCol, ref.tripId));
      if (tripDoc.exists()) {
        sharedTrips.push({ id: tripDoc.id, ...tripDoc.data() } as Trip);
      }
    }

    // Merge owned and shared trips
    return [...ownedTrips, ...sharedTrips];
  },

  /**
   * Saves multiple trips.
   * @param trips - The array of trip objects to save.
   */
  async save(trips: Trip[]) {
    if (!isAuthenticated())
      throw new Error("Authentication required to save trips.");
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
      user!.uid,
    );
  },

  /**
   * Add a new trip.
   * @param trip - The trip object to add.
   */
  async add(trip: Trip): Promise<Trip> {
    if (!isAuthenticated())
      throw new Error("Authentication required to add a trip.");
    const user = getCurrentUser();

    // Ensure owner is always in participants
    const participants = Array.isArray(trip.participants)
      ? [...trip.participants]
      : [];
    if (!participants.includes(user!.uid)) {
      participants.push(user!.uid);
    }
    const tripForFirestore = {
      ...trip,
      participants,
      startDate: trip.startDate === undefined ? null : trip.startDate,
      endDate: trip.endDate === undefined ? null : trip.endDate,
    };
    const tripsCol = getUserCollection("trips");
    await setDoc(doc(tripsCol, trip.id), tripForFirestore);

    // Add shared trip references for participants (excluding owner)
    for (const participantUid of participants) {
      if (participantUid !== user!.uid) {
        const sharedRefDoc = doc(
          collection(db, `users/${participantUid}/sharedTrips`),
          trip.id,
        );
        await setDoc(sharedRefDoc, { ownerUid: user!.uid, tripId: trip.id });
      }
    }

    await logUserActivity(
      411,
      {
        tripId: trip.id,
        itemName: trip.name,
        userName: user!.displayName,
      },
      user!.uid,
    );
    await profileService.updateVisitedCountryCodes(user!.uid);

    return tripForFirestore as Trip;
  },

  /**
   * Update the favorite status of a trip.
   * @param tripId - The ID of the trip to update.
   * @param favorite - The new favorite status.
   */
  async updateFavorite(tripId: string, favorite: boolean) {
    if (!isAuthenticated())
      throw new Error("Authentication required to update favorite.");
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
      user!.uid,
    );
  },

  /**
   * Update the rating of a trip.
   * @param tripId - The ID of the trip to update.
   * @param rating - The new rating value.
   */
  async updateRating(tripId: string, rating: number | undefined) {
    const ratingValue = rating === undefined ? null : rating;
    if (!isAuthenticated())
      throw new Error("Authentication required to update rating.");
    const user = getCurrentUser();
    const tripsCol = getUserCollection("trips");
    const tripRef = doc(tripsCol, tripId);
    await setDoc(tripRef, { rating: ratingValue }, { merge: true });
    await logUserActivity(
      414,
      {
        itemName: tripId,
        rating: ratingValue,
        userName: user!.displayName,
      },
      user!.uid,
    );
  },

  /**
   * Edits an existing trip.
   * @param trip - The trip object with updated data.
   */
  async edit(trip: Trip) {
    if (!isAuthenticated())
      throw new Error("Authentication required to edit a trip.");
    const user = getCurrentUser();

    // Ensure owner is always in participants
    const participants = Array.isArray(trip.participants)
      ? [...trip.participants]
      : [];
    if (!participants.includes(user!.uid)) {
      participants.push(user!.uid);
    }

    // Prepare Firestore object with nulls for undefined dates
    const tripForFirestore = {
      ...trip,
      participants,
      startDate: trip.startDate === undefined ? null : trip.startDate,
      endDate: trip.endDate === undefined ? null : trip.endDate,
    };
    const tripsCol = getUserCollection("trips");

    // Fetch previous trip to compare participants
    const prevTripDoc = await getDoc(doc(tripsCol, trip.id));
    let prevParticipants: string[] = [];
    if (prevTripDoc.exists()) {
      const prevData = prevTripDoc.data() as Trip;
      prevParticipants = prevData.participants || [];
    }
    await setDoc(
      doc(tripsCol, trip.id),
      tripForFirestore as Record<string, unknown>,
    );

    // Update shared trip references for participants
    const newParticipants = participants;
    const added = newParticipants.filter(
      (uid) => uid !== user!.uid && !prevParticipants.includes(uid),
    );
    const removed = prevParticipants.filter(
      (uid) => uid !== user!.uid && !newParticipants.includes(uid),
    );

    // Add new shared trip references
    for (const participantUid of added) {
      const sharedRefDoc = doc(
        collection(db, `users/${participantUid}/sharedTrips`),
        trip.id,
      );
      await setDoc(sharedRefDoc, { ownerUid: user!.uid, tripId: trip.id });
    }

    // Remove shared trip references for removed participants
    for (const participantUid of removed) {
      const sharedRefDoc = doc(
        collection(db, `users/${participantUid}/sharedTrips`),
        trip.id,
      );
      await deleteDoc(sharedRefDoc);
    }
    await logUserActivity(
      412,
      {
        tripId: trip.id,
        itemName: trip.name,
        userName: user!.displayName,
      },
      user!.uid,
    );
    await profileService.updateVisitedCountryCodes(user!.uid);
  },

  /**
   * Removes a trip by ID.
   * @param id - The ID of the trip to remove.
   */
  async remove(id: string) {
    if (!isAuthenticated())
      throw new Error("Authentication required to remove a trip.");
    const user = getCurrentUser();
    const tripsCol = getUserCollection("trips");
    const snapshot = await getDocs(tripsCol);
    const tripDoc = snapshot.docs.find((docSnap) => docSnap.id === id);
    const tripName = tripDoc ? tripDoc.data().name : undefined;

    // Remove shared trip references for all participants
    if (tripDoc) {
      const tripData = tripDoc.data() as Trip;
      const participants = tripData.participants || [];
      for (const participantUid of participants) {
        if (participantUid !== user!.uid) {
          const sharedRefDoc = doc(
            collection(db, `users/${participantUid}/sharedTrips`),
            id,
          );
          await deleteDoc(sharedRefDoc);
        }
      }
    }

    await deleteDoc(doc(tripsCol, id));
    await logUserActivity(
      415,
      {
        tripId: id,
        itemName: tripName,
        userName: user!.displayName,
      },
      user!.uid,
    );
    await profileService.updateVisitedCountryCodes(user!.uid);
  },
};
