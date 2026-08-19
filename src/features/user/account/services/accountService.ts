import { deleteUser, type User } from "firebase/auth";
import {
  deleteDoc,
  runTransaction,
  setDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { logUserActivity } from "@features/activity";
import {
  db,
  getDocData,
  getDocsData,
  getPaths,
  USER_SUBCOLLECTIONS,
} from "@lib/firebase";
import { isUserDeactivated } from "../utils/account";
import { friendService } from "../../friends/services/friendService";
import { profileService } from "../../profile/services/profileService";
import type { FirestoreUser } from "../../profile/types";

type AccountCreationInput = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  joinDate?: Timestamp | string | null;
};

/**
 * Service for managing user account operations.
 */
export const accountService = {
  /**
   * Creates a new user account.
   * @param input - The input data for creating the account.
   * @param ipAddress - The user's IP address (optional).
   * @returns The username of the newly created account.
   */
  async createAccount(
    input: AccountCreationInput,
    ipAddress?: string,
  ): Promise<string> {
    // Check if the account already exists
    const existingAccount = await getDocData<FirestoreUser>(
      getPaths.user(input.uid),
    );

    // If the account already exists, return the existing username
    if (existingAccount) {
      return existingAccount.username;
    }

    // Generate a unique username based on display name or email
    const username = await profileService.generateUniqueUsername(
      input.displayName,
      input.email,
    );

    // Use a transaction to ensure that the username is unique and to create the user document atomically
    await runTransaction(db, async (transaction) => {
      const usernameRef = getPaths.username(username);
      const userRef = getPaths.user(input.uid);

      const usernameSnap = await transaction.get(usernameRef);

      // If the username already exists, throw an error to indicate that the username is taken
      if (usernameSnap.exists()) {
        throw new Error("USERNAME_TAKEN");
      }

      // Create the username document and the user document in a single transaction
      transaction.set(usernameRef, {
        uid: input.uid,
      });

      // Create the user document with the provided input data
      transaction.set(userRef, {
        uid: input.uid,
        username,
        displayName: input.displayName ?? "",
        email: input.email ?? "",
        joinDate: input.joinDate
          ? input.joinDate instanceof Timestamp
            ? input.joinDate
            : Timestamp.fromDate(new Date(input.joinDate))
          : Timestamp.now(),
        photoURL: input.photoURL ?? "",
        isPublic: true,
        status: "active",
      });
    });

    // If an IP address is provided, initialize the user's home country based on their location
    if (ipAddress) {
      await profileService.initializeUserCountry(input.uid, ipAddress);
    }

    return username;
  },

  /**
   * Ensures that a Firebase account exists for a Firebase user.
   * @param input - The input data for creating the account.
   * @param ipAddress - The user's IP address (optional).
   * @returns The username of the existing or newly created account.
   */
  async ensureAccount(
    input: AccountCreationInput,
    ipAddress?: string,
  ): Promise<string> {
    const existingAccount = await getDocData<FirestoreUser>(
      getPaths.user(input.uid),
    );

    // If the account already exists, return the existing username
    if (existingAccount) {
      return existingAccount.username;
    }

    return this.createAccount(input, ipAddress);
  },

  /**
   * Reactivates a deactivated user account.
   * @param uid - The user's unique identifier.
   * @returns True if the account was reactivated, false otherwise.
   */
  async reactivateAccount(uid: string): Promise<boolean> {
    const userDocRef = getPaths.user(uid);
    const userData = await getDocData<FirestoreUser>(userDocRef);

    if (userData && isUserDeactivated(userData.status)) {
      await setDoc(
        userDocRef,
        { status: "active", reactivatedAt: new Date().toISOString() },
        { merge: true },
      );
      return true;
    }
    return false;
  },

  /**
   * Deactivates the user's account.
   * @param user - The Firebase User object.
   */
  async deactivateAccount(uid: string) {
    await setDoc(
      getPaths.user(uid),
      { status: "deactivated", deactivatedAt: new Date().toISOString() },
      { merge: true },
    );
    await logUserActivity(102, {}, uid);
  },

  /**
   * Deletes the user's app account and all associated data.
   * @param user - The Firebase User object.
   */
  async deleteAccount(user: User) {
    const uid = user.uid;

    // Remove deleted user from other users' friends lists
    const userFriends = await getDocsData(getPaths.sub(uid, "friends"));
    await Promise.all(
      userFriends.map((friend) => friendService.removeFriend(friend.id, uid)),
    );

    // Remove from usernames collection
    const usernames = await getDocsData(getPaths.usernames());
    const usernameDoc = usernames.find((doc) => doc.uid === uid);
    if (usernameDoc) {
      await deleteDoc(getPaths.username(usernameDoc.id));
    }

    // Delete all Firestore user data client-side
    for (const subKey of USER_SUBCOLLECTIONS) {
      const subDocs = await getDocsData(getPaths.sub(uid, subKey));
      if (subDocs.length === 0) continue;

      const batch = writeBatch(db);
      subDocs.forEach((docObj) => {
        batch.delete(getPaths.subDoc(uid, subKey, docObj.id));
      });
      await batch.commit();
    }

    // Delete the main user document and Firebase Auth user
    await deleteDoc(getPaths.user(uid));
    await deleteUser(user);
  },
};
