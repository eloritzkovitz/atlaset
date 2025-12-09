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
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { logUserActivity } from "@utils/firebase";
import { auth } from "../../../../firebase";

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  await logUserActivity(
    "login",
    {
      method: "email",
      userName: result.user.displayName,
      email: result.user.email,
    },
    result.user!.uid
  );
  return result;
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
  await logUserActivity(
    "login",
    {
      method: keepLoggedIn ? "email_persistent" : "email_session",
      userName: result.user.displayName,
      email: result.user.email,
    },
    result.user!.uid
  );
  return result;
}

// Sign up with email and password
export async function signUp(email: string, password: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await logUserActivity(
    "signup",
    {
      method: "email",
      userName: result.user.displayName,
      email: result.user.email,
    },
    result.user!.uid
  );
  return result;
}

// Sign out
export async function logout() {
  const user = auth.currentUser;
  await signOut(auth);
  if (user) {
    await logUserActivity("logout", {}, user.uid);
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
  await logUserActivity(
    "login",
    {
      method: "google",
      userName: result.user.displayName,
      email: result.user.email,
    },
    result.user!.uid
  );
  return result;
}

// Sign in anonymously
export async function signInAsGuest() {
  const result = await signInAnonymously(auth);
  return result;
}
