import { db } from "firebase";
import { doc, getDoc, runTransaction } from "firebase/firestore";

// Auto-generate a unique username from displayName or email
export async function generateUniqueUsername(
  displayName: string | null,
  email: string | null
): Promise<string> {
  let base = displayName
    ? displayName.toLowerCase().replace(/[^a-z0-9]/g, "")
    : email
    ? email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
    : "user";
  let username = base;
  let suffix = 0;
  while (true) {
    const usernameRef = doc(db, "usernames", username);
    const usernameSnap = await getDoc(usernameRef);
    if (!usernameSnap.exists()) break;
    suffix++;
    username = `${base}${suffix}`;
  }
  return username;
}

// Create user profile and reserve username atomically
export async function createUserProfileWithUsername(user: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
}) {
  const username = await generateUniqueUsername(user.displayName, user.email);

  // Use a transaction to ensure username uniqueness
  await runTransaction(db, async (transaction) => {
    const usernameRef = doc(db, "usernames", username);
    const userRef = doc(db, "users", username);
    const usernameSnap = await transaction.get(usernameRef);
    if (usernameSnap.exists()) {
      throw new Error("Username taken");
    }
    transaction.set(usernameRef, { uid: user.uid });
    transaction.set(userRef, {
      uid: user.uid,
      username,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      bio: "",
      isPublic: true,
    });
  });
  return username;
}

// Change username atomically
export async function changeUsername({
  uid,
  oldUsername,
  newUsername,
}: {
  uid: string;
  oldUsername: string;
  newUsername: string;
}) {
  // Clean new username
  const cleanUsername = newUsername.toLowerCase().replace(/[^a-z0-9]/g, "");
  await runTransaction(db, async (transaction) => {
    const newUsernameRef = doc(db, "usernames", cleanUsername);
    const oldUsernameRef = doc(db, "usernames", oldUsername);
    const userRef = doc(db, "users", uid);
    const usernameSnap = await transaction.get(newUsernameRef);
    if (usernameSnap.exists()) {
      throw new Error("Username taken");
    }
    // Update username field in user doc
    transaction.update(userRef, { username: cleanUsername });
    // Create new username doc
    transaction.set(newUsernameRef, { uid });
    // Delete old username doc
    transaction.delete(oldUsernameRef);
  });
  return cleanUsername;
}
