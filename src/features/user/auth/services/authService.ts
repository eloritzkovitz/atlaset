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
import { doc, setDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { logUserActivity } from "@utils/firebase";
import { auth, db } from "../../../../firebase";
import { checkAndReactivateUser } from "../utils/auth";
import { getDeviceInfo, logDevice, removeDevice } from "../utils/device";
import { createUserProfileWithUsername } from "../../profile/services/profileService";

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);

  // Check if account is deactivated and reactivate if so
  const reactivated = await checkAndReactivateUser(result.user);

  // Log user activity
  await logUserActivity(
    "login",
    {
      method: "email",
      userName: result.user.displayName,
      email: result.user.email,
      device: getDeviceInfo().userAgent,
    },
    result.user!.uid
  );
  await logDevice(result.user!.uid);

  return { user: result.user, reactivated };
}

// Sign in with email and password with persistence option
export async function signInWithPersistence(
  email: string,
  password: string,
  keepLoggedIn: boolean
) {
  await setPersistence(
    auth,
    keepLoggedIn ? browserLocalPersistence : browserSessionPersistence
  );
  const result = await signInWithEmailAndPassword(auth, email, password);

  // Check if account is deactivated and reactivate if so
  const reactivated = await checkAndReactivateUser(result.user);

  await logUserActivity(
    "login",
    {
      method: keepLoggedIn ? "email_persistent" : "email_session",
      userName: result.user.displayName,
      email: result.user.email,
      device: getDeviceInfo().userAgent,
    },
    result.user!.uid
  );
  await logDevice(result.user!.uid);

  return { user: result.user, reactivated };
}

// Sign up with email and password
export async function signUp(email: string, password: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const username = await createUserProfileWithUsername({
    uid: result.user.uid,
    displayName: result.user.displayName,
    email: result.user.email,
    photoURL: result.user.photoURL,
    joinDate: result.user.metadata.creationTime,
  });
  await logUserActivity(
    "signup",
    {
      method: "email",
      userName: result.user.displayName,
      email: result.user.email,
      device: getDeviceInfo().userAgent,
    },
    result.user!.uid
  );
  await logDevice(result.user!.uid);
  return { ...result, username };
}

// Sign out
export async function logout() {
  const user = auth.currentUser;
  const uid = user?.uid;
  await signOut(auth);
  if (uid) {
    await logUserActivity("logout", {}, uid);
    await removeDevice(uid);
  }
}

// Send password reset email
export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
  await logUserActivity("reset_password", { email });
}

// Update user profile
export async function updateUserProfile(
  user: User,
  data: { displayName?: string; photoURL?: string }
) {
  await updateProfile(user, data);
  await logUserActivity(
    "edit_profile",
    {
      ...data,
      userName: data.displayName,
      email: user.email,
    },
    user.uid
  );
}

// Sign in with Google
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);

  // Create Firestore profile and username if not already present
  await createUserProfileWithUsername({
    uid: result.user.uid,
    displayName: result.user.displayName,
    email: result.user.email,
    photoURL: result.user.photoURL,
  });

  await logUserActivity(
    "login",
    {
      method: "google",
      userName: result.user.displayName,
      email: result.user.email,
      device: getDeviceInfo().userAgent,
    },
    result.user!.uid
  );
  await logDevice(result.user!.uid);
  return result;
}

// Deactivate user account
export async function deactivateAccount(user: User) {
  // Mark the user as deactivated in Firestore
  await setDoc(
    doc(db, "users", user.uid),
    { status: "deactivated", deactivatedAt: new Date().toISOString() },
    { merge: true }
  );
  await logout();
}

// Delete user account and associated data
export async function deleteAppAccount(user: User) {
  // 1. Call the Cloud Function to delete all Firestore user data
  try {
    const functions = getFunctions();
    const deleteUserData = httpsCallable(functions, "deleteUserData");
    await deleteUserData(); // No arguments needed, uses current user's auth context
  } catch (e) {
    console.error("Error deleting user Firestore data via Cloud Function:", e);
  }

  // 2. Delete Firebase Auth user (removes login for this app)
  await deleteUser(user);
}
