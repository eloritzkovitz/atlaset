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
