import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  type User,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../..//firebase";

// Sign in with email and password
export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Sign up with email and password
export async function signUp(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Sign out
export async function logout() {
  return signOut(auth);
}

// Send password reset email
export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

// Update user profile
export async function updateUserProfile(
  user: User,
  data: { displayName?: string; photoURL?: string }
) {
  return updateProfile(user, data);
}

// Sign in with Google
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

// Sign in anonymously
export async function signInAsGuest() {
  return signInAnonymously(auth);
}
