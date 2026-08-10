import { deleteUser, type User } from "firebase/auth";
import { writeBatch, setDoc, deleteDoc } from "firebase/firestore";
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
import type { FirestoreUser } from "../../profile/types";

/**
 * Service for managing user account operations.
 */
export const accountService = {
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
    await logUserActivity(110, {}, uid);
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
