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
} from "firebase/auth";
import { logUserActivity } from "@features/activity";
import { auth } from "@lib/firebase";
import { sessionService } from "./sessionService";
import type { AuthMethod } from "../types";
import { getBrowserSessionInfo } from "../utils/session";
import { accountService } from "../../account/services/accountService";
import { profileService } from "../../profile/services/profileService";

/** Internal helper for constructing standard user activity payloads */
const createAuthActivityMeta = (user: User, method: AuthMethod) => ({
  method,
  userName: user.displayName,
  email: user.email,
  device: getBrowserSessionInfo().userAgent,
});

/**
 * Service for managing user authentication.
 */
export const authService = {
  /**
   * Signs in a user with email and password, with optional session persistence.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @param keepLoggedIn - If true, keeps user logged in across browser restarts. Defaults to false.
   * @returns The signed-in user and reactivation status.
   */
  async signIn(email: string, password: string, keepLoggedIn = false) {
    await setPersistence(
      auth,
      keepLoggedIn ? browserLocalPersistence : browserSessionPersistence,
    );

    const result = await signInWithEmailAndPassword(auth, email, password);
    const method = keepLoggedIn ? "email_persistent" : "email";

    const reactivated = await this.completeSignIn(result.user, method);
    return { user: result.user, reactivated };
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

    const reactivated = await this.completeSignIn(result.user, "google");

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
      createAuthActivityMeta(result.user, "email"),
      result.user.uid,
    );

    await sessionService.logSession(result.user.uid);
    return { ...result, username };
  },

  /**
   * Logs out the current user.
   */
  async logout() {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      await logUserActivity(103, {}, uid);
      await sessionService.terminateSession(uid);
    }
    await signOut(auth);
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
   * Handles post-sign-in tasks, including reactivation checks, activity logging, and session logging.
   * @param user - The signed-in Firebase User object.
   * @param method - The authentication method used.
   * @returns True if the account was reactivated, false otherwise.
   */
  async completeSignIn(user: User, method: AuthMethod) {
    const reactivated = await accountService.reactivateAccount(user.uid);
    if (reactivated) {
      await logUserActivity(
        111,
        { userName: user.displayName, email: user.email },
        user.uid,
      );
    }

    await logUserActivity(102, createAuthActivityMeta(user, method), user.uid);
    await sessionService.logSession(user.uid);

    return reactivated;
  },
};
