import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { logUserActivity } from "@features/activity";
import {
  db,
  getUserCollection,
  getCurrentUser,
  getPaths,
  getDocsData,
  getDocData,
} from "@lib/firebase";
import { sharedTripsService } from "./sharedTripsService";
import type { SharedTrip, Trip } from "../types";
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
    const user = getCurrentUser();
    if (!user) throw new Error("Authentication required.");

    // Fetch trips owned by the user
    const ownedTrips = await getDocsData<Trip>(getPaths.sub(user.uid, "trips"));

    // Fetch shared trip references
    const sharedRefs = await getDocsData<SharedTrip>(
      getPaths.sub(user.uid, "sharedTrips"),
    );

    // Fetch each shared trip from the owner's collection
    const sharedTrips = await Promise.all(
      sharedRefs.map(async (ref) => {
        return await getDocData<Trip>(
          doc(db, `users/${ref.ownerUid}/trips`, ref.tripId),
        );
      }),
    );

    // Merge owned and shared trips
    return [...ownedTrips, ...sharedTrips.filter((t): t is Trip => t !== null)];
  },

  /**
   * Saves multiple trips.
   * @param trips - The array of trip objects to save.
   */
  async save(trips: Trip[]) {
    const user = getCurrentUser();
    if (!user) throw new Error("Authentication required to save trips.");

    const tripsCol = getUserCollection("trips");
    for (const trip of trips) {
      await setDoc(doc(tripsCol, trip.id), trip);
    }
    await logUserActivity(
      410,
      {
        count: trips.length,
        userName: user.displayName,
      },
      user.uid,
    );
  },

  /**
   * Add a new trip.
   * @param trip - The trip object to add.
   */
  async add(trip: Trip): Promise<Trip> {
    const user = getCurrentUser();
    if (!user) throw new Error("Authentication required to add a trip.");

    // Ensure owner is always in participants
    const participants = Array.isArray(trip.participants)
      ? [...trip.participants]
      : [];
    if (!participants.includes(user.uid)) {
      participants.push(user.uid);
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
      if (participantUid !== user.uid) {
        await sharedTripsService.addReference(
          participantUid,
          user.uid,
          trip.id,
        );
      }
    }

    await logUserActivity(
      411,
      {
        tripId: trip.id,
        itemName: trip.name,
        userName: user.displayName,
      },
      user.uid,
    );
    await profileService.updateVisitedCountryCodes(user.uid);

    return tripForFirestore as Trip;
  },

  /**
   * Update the favorite status of a trip.
   * @param trip - The trip object to update.
   * @param favorite - The new favorite status.
   */
  async updateFavorite(trip: Trip, favorite: boolean) {
    const user = getCurrentUser();
    if (!user) throw new Error("Authentication required to update favorite.");

    const tripsCol = getUserCollection("trips");
    const tripRef = doc(tripsCol, trip.id);
    await setDoc(tripRef, { favorite }, { merge: true });
    await logUserActivity(
      413,
      {
        tripId: trip.id,
        itemName: trip.name,
        userName: user.displayName,
        favorite,
        action: favorite ? "favorited" : "unfavorited",
      },
      user.uid,
    );
  },

  /**
   * Update the rating of a trip.
   * @param trip - The trip object to update.
   * @param rating - The new rating value.
   */
  async updateRating(trip: Trip, rating: number | undefined) {
    const user = getCurrentUser();
    if (!user) throw new Error("Authentication required to update rating.");

    const ratingValue = rating === undefined ? null : rating;
    const tripsCol = getUserCollection("trips");
    const tripRef = doc(tripsCol, trip.id);
    await setDoc(tripRef, { rating: ratingValue }, { merge: true });
    await logUserActivity(
      414,
      {
        userName: user.displayName,
        itemName: trip.name,
        rating: ratingValue,
      },
      user.uid,
    );
  },

  /**
   * Edits an existing trip.
   * @param trip - The trip object with updated data.
   */
  async edit(trip: Trip) {
    const user = getCurrentUser();
    if (!user) throw new Error("Authentication required to edit a trip.");

    // Ensure owner is always in participants
    const participants = Array.isArray(trip.participants)
      ? [...trip.participants]
      : [];
    if (!participants.includes(user.uid)) {
      participants.push(user.uid);
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
    const tripDocRef = doc(getPaths.sub(user.uid, "trips"), trip.id);
    const prevTrip = await getDocData<Trip>(tripDocRef);
    const prevParticipants = prevTrip?.participants || [];
    await setDoc(
      doc(tripsCol, trip.id),
      tripForFirestore as Record<string, unknown>,
    );

    // Update shared trip references for participants
    const newParticipants = participants;
    const added = newParticipants.filter(
      (uid) => uid !== user.uid && !prevParticipants.includes(uid),
    );
    const removed = prevParticipants.filter(
      (uid) => uid !== user.uid && !newParticipants.includes(uid),
    );

    // Add new shared trip references
    for (const participantUid of added) {
      await sharedTripsService.addReference(participantUid, user.uid, trip.id);
    }

    // Remove shared trip references for removed participants
    for (const participantUid of removed) {
      await sharedTripsService.removeReference(participantUid, trip.id);
    }

    await logUserActivity(
      412,
      {
        tripId: trip.id,
        itemName: trip.name,
        userName: user.displayName,
      },
      user.uid,
    );
    await profileService.updateVisitedCountryCodes(user.uid);
  },

  /**
   * Removes a trip.
   * @param trip - The trip object to remove.
   */
  async remove(trip: Trip) {
    const user = getCurrentUser();
    if (!user) throw new Error("Authentication required to edit a trip.");

    const tripDocRef = doc(getPaths.sub(user.uid, "trips"), trip.id);

    // Remove shared trip references for all participants
    const participants = trip.participants || [];
    for (const participantUid of participants) {
      if (participantUid !== user.uid) {
        await sharedTripsService.removeReference(participantUid, trip.id);
      }
    }

    await deleteDoc(tripDocRef);

    await logUserActivity(
      415,
      {
        tripId: trip.id,
        itemName: trip.name,
        userName: user.displayName,
      },
      user.uid,
    );
    await profileService.updateVisitedCountryCodes(user.uid);
  },
};
