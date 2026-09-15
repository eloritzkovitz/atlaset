import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { ACTIONS, type Action } from "@constants/actions";
import { logUserActivity } from "@features/activity";
import { notificationService } from "@features/notifications";
import { profileService } from "@features/user/profile/services/profileService";
import {
  db,
  getUserCollection,
  getCurrentUser,
  getPaths,
  getDocsData,
  getDocData,
} from "@lib/firebase";
import type { Trip } from "../types";
import { sharedTripsService } from "../../sharing/services/sharedTripsService";
import type { SharedTrip, TripShares } from "../../sharing/types";

// Sends a notification to a participant about a trip action.
const sendParticipantNotification = async (
  participantUid: string,
  action: Action,
  user: NonNullable<ReturnType<typeof getCurrentUser>>,
  trip: Trip,
) => {
  await notificationService.send(participantUid, {
    action,
    actor: {
      uid: user.uid,
      displayName: user.displayName ?? "",
      photoURL: user.photoURL ?? "",
    },
    details: {
      actorName: user.displayName ?? "",
      itemId: trip.id,
      itemName: trip.name,
    },
  });
};

/** Synchronizes trip shares with the shared trips service. */
async function syncTripShares(
  trip: Trip,
  previousTrip: Trip | null,
  shares: TripShares | undefined,
  ownerUid: string,
) {
  const participants = new Set(trip.participants ?? []);
  const previousParticipants = new Set(previousTrip?.participants ?? []);
  const currentRecipients = new Set([
    ...(trip.sharedWith ?? []),
    ...participants,
  ]);
  const previousRecipients = new Set([
    ...(previousTrip?.sharedWith ?? []),
    ...previousParticipants,
  ]);

  for (const uid of currentRecipients) {
    if (uid === ownerUid) continue;

    const share = shares?.get(uid);
    await sharedTripsService.addReference(
      uid,
      ownerUid,
      trip.id,
      participants.has(uid) ? "participant" : (share?.type ?? "shared"),
      share?.permission ?? "viewer",
    );
  }

  for (const uid of previousRecipients) {
    if (uid !== ownerUid && !currentRecipients.has(uid)) {
      await sharedTripsService.removeReference(uid, trip.id);
    }
  }

  return previousParticipants;
}

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
  async add(trip: Trip, shares?: TripShares): Promise<Trip> {
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

    await syncTripShares({ ...trip, participants }, null, shares, user.uid);

    for (const participantUid of participants) {
      if (participantUid !== user.uid) {
        await sendParticipantNotification(
          participantUid,
          ACTIONS.TRIP_PARTICIPANT_ADDED,
          user,
          trip,
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
  async edit(trip: Trip, shares?: TripShares) {
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
    await setDoc(
      doc(tripsCol, trip.id),
      tripForFirestore as Record<string, unknown>,
    );

    const previousParticipants = await syncTripShares(
      { ...trip, participants },
      prevTrip,
      shares,
      user.uid,
    );
    const added = participants.filter(
      (uid) => uid !== user.uid && !previousParticipants.has(uid),
    );
    const removed = [...previousParticipants].filter(
      (uid) => uid !== user.uid && !participants.includes(uid),
    );

    for (const participantUid of added) {
      await sendParticipantNotification(
        participantUid,
        ACTIONS.TRIP_PARTICIPANT_ADDED,
        user,
        trip,
      );
    }

    for (const participantUid of removed) {
      await sendParticipantNotification(
        participantUid,
        ACTIONS.TRIP_PARTICIPANT_REMOVED,
        user,
        trip,
      );
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

    // Remove shared references for all recipients (sharedWith and participants)
    const recipients = new Set([
      ...(trip.sharedWith ?? []),
      ...(trip.participants ?? []),
    ]);

    for (const recipientUid of recipients) {
      if (recipientUid !== user.uid) {
        await sharedTripsService.removeReference(recipientUid, trip.id);

        if (trip.participants?.includes(recipientUid)) {
          await sendParticipantNotification(
            recipientUid,
            ACTIONS.TRIP_PARTICIPANT_REMOVED,
            user,
            trip,
          );
        }
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
