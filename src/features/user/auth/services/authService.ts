import {
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  type User,
  signInWithPopup,
  GoogleAuthProvider,
  deleteUser,
} from "firebase/auth";
import { deleteDoc, setDoc } from "firebase/firestore";
import { auth } from "@app/firebase";
import { logUserActivity } from "@features/activity";
import type { FirestoreUser } from "@features/user/types";
import {
  getDocData,
  getDocsData,
  getPaths,
  type UserSubcollections,
} from "@lib/firebase";
import { migrationService } from "@services/migrationService";
import { sessionService } from "./sessionService";
import { isUserDeactivated } from "../utils/auth";
import { getBrowserSessionInfo } from "../utils/session";
import { friendService } from "../../friends/services/friendService";
import { profileService } from "../../profile/services/profileService";

/**
 * Service for managing user authentication.
 */
export const authService = {
  /**
   * Signs in a user with email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns The signed-in user and reactivation status.
   */
  async signIn(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Migrate guest data to Firestore if it exists
    if (await migrationService.hasGuestData()) {
      await migrationService.migrateGuestDataToFirestore();
    }

    // Check if account is deactivated and reactivate if so
    const reactivated = await this.handleReactivation(result.user.uid);

    await logUserActivity(
      102,
      {
        method: "email",
        userName: result.user.displayName,
        email: result.user.email,
        device: getBrowserSessionInfo().userAgent,
      },
      result.user!.uid,
    );
    await sessionService.logSession(result.user.uid);

    return { user: result.user, reactivated };
  },

  /** * Signs in a user with email and password, with persistence option.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @param keepLoggedIn - Whether to keep the user logged in across sessions.
   * @returns The signed-in user and reactivation status.
   */
  async signInWithPersistence(
    email: string,
    password: string,
    keepLoggedIn: boolean,
  ) {
    await setPersistence(
      auth,
      keepLoggedIn ? browserLocalPersistence : browserSessionPersistence,
    );
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Migrate guest data if it exists
    if (await migrationService.hasGuestData()) {
      await migrationService.migrateGuestDataToFirestore();
    }

    // Check if account is deactivated and reactivate if so
    const reactivated = await this.handleReactivation(result.user.uid);
    if (reactivated) {
      await logUserActivity(
        111,
        { userName: result.user.displayName, email: result.user.email },
        result.user.uid,
      );
    }

    await logUserActivity(
      102,
      {
        method: keepLoggedIn ? "email_persistent" : "email_session",
        userName: result.user.displayName,
        email: result.user.email,
        device: getBrowserSessionInfo().userAgent,
      },
      result.user!.uid,
    );
    await sessionService.logSession(result.user!.uid);

    return { user: result.user, reactivated };
  },

  /**
   * Signs up a new user with email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns The result of the user creation.
   */
  async signUp(email: string, password: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const username = await profileService.createUserProfileWithUsername({
      uid: result.user.uid,
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      joinDate: result.user.metadata.creationTime,
    });

    await logUserActivity(
      101,
      {
        method: "email",
        userName: result.user.displayName,
        email: result.user.email,
        device: getBrowserSessionInfo().userAgent,
      },
      result.user!.uid,
    );

    await sessionService.logSession(result.user!.uid);
    return { ...result, username };
  },

  /**
   * Logs out the current user.
   */
  async logout() {
    const user = auth.currentUser;
    const uid = user?.uid;
    await signOut(auth);
    if (uid) {
      await logUserActivity(103, {}, uid);
      await sessionService.terminateSession(uid);
    }
  },

  /**
   * Resets the password for the given email.
   * @param email - The user's email address.
   */
  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
    const uid = auth.currentUser?.uid;
    if (uid) {
      await logUserActivity(104, { email }, uid);
    }
  },

  /**
   * Updates the user's profile information.
   * @param user - The Firebase User object.
   * @param data - An object containing the profile fields to update.
   */
  async updateUserProfile(
    user: User,
    data: { displayName?: string; photoURL?: string },
  ) {
    await updateProfile(user, data);
    await logUserActivity(
      120,
      {
        ...data,
        userName: data.displayName,
        email: user.email,
      },
      user.uid,
    );
  },

  /**
   * Signs in a user with Google OAuth.
   * @returns The result of the sign-in operation.
   */
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Create Firestore profile and username if not already present
    await profileService.createUserProfileWithUsername({
      uid: result.user.uid,
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
    });

    await logUserActivity(
      102,
      {
        method: "google",
        userName: result.user.displayName,
        email: result.user.email,
        device: getBrowserSessionInfo().userAgent,
      },
      result.user!.uid,
    );
    await sessionService.logSession(result.user!.uid);
    return result;
  },

  /**
   * Deactivates the user's account.
   * @param user - The Firebase User object.
   */
  async deactivateAccount(user: User) {
    await setDoc(
      getPaths.user(user.uid),
      { status: "deactivated", deactivatedAt: new Date().toISOString() },
      { merge: true },
    );
    await logUserActivity(110, {}, user.uid);
    await this.logout();
  },

  /**
   * Deletes the user's app account and all associated data.
   * @param user - The Firebase User object.
   */

  async deleteAppAccount(user: User) {
    const uid = user.uid;

    // Remove deleted user from other users' friends lists
    const users = await getDocsData(getPaths.users());
    for (const remoteUser of users) {
      if (remoteUser.id !== uid) {
        await friendService.removeFriend(remoteUser.id, uid);
      }
    }

    // Remove from usernames collection
    const usernames = await getDocsData(getPaths.usernames());
    for (const usernameDoc of usernames) {
      if (usernameDoc.uid === uid) {
        await deleteDoc(getPaths.username(usernameDoc.id));
      }
    }

    // Delete all Firestore user data client-side
    const userSubcollections = [
      "activity",
      "countryLists",
      "friends",
      "friendRequests",
      "layers",
      "markers",
      "savedMaps",
      "sessions",
      "settings",
      "sharedTrips",
      "trips",
    ];

    for (const sub of userSubcollections) {
      const subKey = sub as keyof UserSubcollections;

      const subColDocs = await getDocsData(getPaths.sub(uid, subKey));
      for (const docObj of subColDocs) {
        await deleteDoc(getPaths.subDoc(uid, subKey, docObj.id));
      }
    }

    // Delete the main user document and Firebase Auth user
    await deleteDoc(getPaths.user(uid));
    await deleteUser(user);
  },

  /**
   * Reactivates a deactivated user account.
   * @param uid - The user's unique identifier.
   * @returns True if the account was reactivated, false otherwise.
   */
  async handleReactivation(uid: string): Promise<boolean> {
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
};
