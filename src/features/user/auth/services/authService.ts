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
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@app/firebase";
import { logUserActivity } from "@features/activity";
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
      doc(db, "users", user.uid),
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
    // Remove deleted user from other users' friends lists
    const usersSnap = await getDocs(collection(db, "users"));
    for (const userDoc of usersSnap.docs) {
      if (userDoc.id !== user.uid) {
        await friendService.removeFriend(userDoc.id, user.uid);
      }
    }

    // Remove from usernames collection
    const usernamesCol = collection(db, "usernames");
    const usernamesSnap = await getDocs(usernamesCol);
    for (const docSnap of usernamesSnap.docs) {
      const data = docSnap.data();
      if (data.uid === user.uid) {
        await deleteDoc(docSnap.ref);
      }
    }

    // Delete all Firestore user data client-side
    const uid = user.uid;
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
      const subColRef = collection(db, `users/${uid}/${sub}`);
      const snapshot = await getDocs(subColRef);
      for (const docSnap of snapshot.docs) {
        await deleteDoc(docSnap.ref);
      }
    }

    // Delete the main user document and Firebase Auth user
    await deleteDoc(doc(db, "users", uid));
    await deleteUser(user);
  },

  /**
   * Reactivates a deactivated user account.
   * @param uid - The user's unique identifier.
   * @returns True if the account was reactivated, false otherwise.
   */
  async handleReactivation(uid: string): Promise<boolean> {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists() && isUserDeactivated(userDocSnap.data().status)) {
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
