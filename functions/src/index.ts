/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { onDocumentWritten } from "firebase-functions/v2/firestore";

admin.initializeApp();

/**
 * Callable function to recursively delete all user data in Firestore under /users/{uid}
 * Requires the user to be authenticated.
 */
export const deleteUserData = functions.https.onCall(async (context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated."
    );
  }

  const userDocPath = `users/${uid}`;
  try {
    await admin.firestore().recursiveDelete(admin.firestore().doc(userDocPath));
    return { success: true };
  } catch (error: unknown) {
    throw new functions.https.HttpsError(
      "internal",
      "Failed to delete user data",
      error instanceof Error ? error.message : String(error)
    );
  }
});

/**
 * Cloud Function to sync visited countries when a trip is created or updated.
 * Updates the user's visitedCountryCodes in their profile based on completed trips.
 */
export const syncVisitedCountries = onDocumentWritten(
  { document: "trips/{tripId}" },
  async (event) => {
    const tripData = event.data?.after?.data();
    if (!tripData) return;

    // Get userId from the trip data    
    const userId = tripData.userId;
    if (!userId) return;

    // Fetch all completed trips for the user
    const tripsSnap = await admin.firestore()
      .collection("trips")
      .where("userId", "==", userId)
      .where("status", "==", "completed")
      .get();

    // Collect all unique country codes
    const visited = new Set<string>();
    tripsSnap.forEach(doc => {
      const trip = doc.data();
      if (trip.countries && Array.isArray(trip.countries)) {
        trip.countries.forEach((code: string) => visited.add(code));
      }
    });

    // Update the user's profile
    await admin.firestore().collection("users").doc(userId).update({
      visitedCountryCodes: Array.from(visited),
    });
  }
);
