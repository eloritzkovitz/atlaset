import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { logUserActivity } from "@features/activity";
import { auth } from "@lib/firebase";
import type { AuthMethod } from "../types";
import { accountService } from "../../account/services/accountService";
import { sessionService } from "../../account/services/sessionService";
import {
  clearLocalSession,
  getBrowserSessionInfo,
} from "../../account/utils/session";

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
   */
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const ipAddress = await sessionService.getCurrentIpAddress();

    // Create Firestore profile and username if not already present
    await accountService.ensureAccount(
      {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      },
      ipAddress,
    );

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
    const ipAddress = await sessionService.getCurrentIpAddress();

    const username = await accountService.createAccount(
      {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        joinDate: result.user.metadata.creationTime,
      },
      ipAddress,
    );

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
  async logout(): Promise<void> {
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      await sessionService.terminateCurrentSession(uid);
    }

    clearLocalSession();
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
      await logUserActivity(112, { email }, uid);
    }
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
        103,
        { userName: user.displayName, email: user.email },
        user.uid,
      );
    }

    await logUserActivity(110, createAuthActivityMeta(user, method), user.uid);
    await sessionService.logSession(user.uid);

    return reactivated;
  },
};
