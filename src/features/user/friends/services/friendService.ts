import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
  onSnapshot,
  type Unsubscribe,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import type { Friend, FriendRequest } from "@features/user/types";

// Send a friend request to targetUserId
export async function sendFriendRequest(
  currentUserId: string,
  targetUserId: string
) {
  const ref = doc(db, `users/${targetUserId}/friendRequests`, currentUserId);
  const data = {
    from: currentUserId,
    to: targetUserId,
    createdAt: serverTimestamp(),
  };
  await setDoc(ref, data);
}

// Accept a friend request
export async function acceptFriendRequest(
  currentUserId: string,
  requestUserId: string
) {
  // Add each other as friends
  const batch = writeBatch(db);
  const myFriendRef = doc(db, `users/${currentUserId}/friends`, requestUserId);
  const theirFriendRef = doc(
    db,
    `users/${requestUserId}/friends`,
    currentUserId
  );
  batch.set(myFriendRef, { createdAt: serverTimestamp() });
  batch.set(theirFriendRef, { createdAt: serverTimestamp() });
  // Remove the friend request
  const reqRef = doc(
    db,
    `users/${currentUserId}/friendRequests`,
    requestUserId
  );
  batch.delete(reqRef);
  await batch.commit();
}

// Reject a friend request
export async function rejectFriendRequest(
  currentUserId: string,
  requestUserId: string
) {
  const reqRef = doc(
    db,
    `users/${currentUserId}/friendRequests`,
    requestUserId
  );
  await deleteDoc(reqRef);
}

// Remove a friend
export async function removeFriend(
  currentUserId: string,
  friendUserId: string
) {
  const myFriendRef = doc(db, `users/${currentUserId}/friends`, friendUserId);
  const theirFriendRef = doc(
    db,
    `users/${friendUserId}/friends`,
    currentUserId
  );
  await deleteDoc(myFriendRef);
  await deleteDoc(theirFriendRef);
}

// Get all friends for a user
export async function getFriends(userId: string): Promise<Friend[]> {
  const friendsCol = collection(db, `users/${userId}/friends`);
  const snap = await getDocs(friendsCol);
  return snap.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as Friend));
}

// Get all friend requests for a user
export async function getFriendRequests(
  userId: string
): Promise<FriendRequest[]> {
  const reqCol = collection(db, `users/${userId}/friendRequests`);
  const snap = await getDocs(reqCol);
  return snap.docs.map(
    (doc) => ({ uid: doc.id, ...doc.data() } as FriendRequest)
  );
}

// Listen for real-time friend updates
export function listenForFriends(
  userId: string,
  cb: (friends: Friend[]) => void
): Unsubscribe {
  const friendsCol = collection(db, `users/${userId}/friends`);
  return onSnapshot(friendsCol, (snap) => {
    cb(snap.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as Friend)));
  });
}

// Listen for real-time friend requests
export function listenForFriendRequests(
  userId: string,
  cb: (requests: FriendRequest[]) => void
): Unsubscribe {
  const reqCol = collection(db, `users/${userId}/friendRequests`);
  return onSnapshot(reqCol, (snap) => {
    cb(
      snap.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as FriendRequest))
    );
  });
}
