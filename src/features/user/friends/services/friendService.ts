import {
  collection,
  doc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { ACTIONS } from "@constants/actions";
import { logUserActivity } from "@features/activity";
import { notificationService } from "@features/notifications/services/notificationService";
import {
  db,
  getCurrentUser,
  getDocData,
  getDocsData,
  getPaths,
} from "@lib/firebase";
import type { Friend, FriendRequest, FriendRequestData } from "../types";

/**
 * Service for managing user friends and friend requests.
 */
export const friendService = {
  /**
   * Sends a friend request.
   * @param currentUserId - The ID of the user sending the request.
   * @param targetUserId - The ID of the user to receive the request.
   */
  async sendFriendRequest(currentUserId: string, targetUserId: string) {
    const ref = getPaths.friendRequestDoc(targetUserId, currentUserId);

    const data: FriendRequestData = {
      from: currentUserId,
      to: targetUserId,
      createdAt: serverTimestamp(),
    };

    await setDoc(ref, data);

    const currentUser = getCurrentUser();

    // Send a notification to the target user about the friend request
    await notificationService.send(targetUserId, {
      action: ACTIONS.FRIEND_REQUEST_SENT,
      actor: {
        uid: currentUserId,
        displayName: currentUser?.displayName ?? "",
        photoURL: currentUser?.photoURL ?? "",
      },
    });
  },

  /**
   * Accepts a friend request and establishes a friendship between two users.
   * @param currentUserId - The ID of the user accepting the request.
   * @param requestUserId - The ID of the user who sent the request.
   * @param requestUserName - The name of the user who sent the request.
   */
  async acceptFriendRequest(
    currentUserId: string,
    requestUserId: string,
    requestUserName?: string,
  ) {
    const currentUser = getCurrentUser();

    const batch = writeBatch(db);
    batch.set(getPaths.friendDoc(currentUserId, requestUserId), {
      uid: requestUserId,
      createdAt: serverTimestamp(),
    });
    batch.set(getPaths.friendDoc(requestUserId, currentUserId), {
      uid: currentUserId,
      createdAt: serverTimestamp(),
    });
    batch.delete(getPaths.friendRequestDoc(currentUserId, requestUserId));

    await batch.commit();

    // Log user activity for the current user
    await logUserActivity(
      ACTIONS.FRIENDSHIP_ESTABLISHED,
      {
        friendId: requestUserId,
        userName: currentUser?.displayName ?? "",
        friendName: requestUserName ?? "",
      },
      currentUserId,
    );

    // Log user activity for the request user
    await logUserActivity(
      ACTIONS.FRIENDSHIP_ESTABLISHED,
      {
        friendId: currentUserId,
        userName: requestUserName ?? "",
        friendName: currentUser?.displayName ?? "",
      },
      requestUserId,
    );

    // Send a notification to the request user about the acceptance
    await notificationService.send(requestUserId, {
      action: ACTIONS.FRIEND_REQUEST_ACCEPTED,
      actor: {
        uid: currentUserId,
        displayName: currentUser?.displayName ?? "",
        photoURL: currentUser?.photoURL ?? "",
      },
    });
  },

  /**
   * Rejects a friend request.
   * @param currentUserId - The ID of the user rejecting the request.
   * @param requestUserId - The ID of the user who sent the request.
   */
  async rejectFriendRequest(currentUserId: string, requestUserId: string) {
    const reqRef = doc(
      db,
      `users/${currentUserId}/friendRequests`,
      requestUserId,
    );
    await deleteDoc(reqRef);
  },

  /**
   * Removes a friend.
   * @param currentUserId = The ID of the user removing the friend.
   * @param friendUserId - The ID of the friend to remove.
   */
  async removeFriend(currentUserId: string, friendUserId: string) {
    const myFriendRef = doc(db, `users/${currentUserId}/friends`, friendUserId);
    const theirFriendRef = doc(
      db,
      `users/${friendUserId}/friends`,
      currentUserId,
    );
    await deleteDoc(myFriendRef);
    await deleteDoc(theirFriendRef);
  },

  /**
   * Gets all friends for a user.
   * @param userId - The user ID to get friends for.
   * @returns - An array of Friend objects.
   */
  async getFriends(userId: string): Promise<Friend[]> {
    return await getDocsData<Friend>(getPaths.sub(userId, "friends"));
  },

  /**
   * Gets all friend requests for a user.
   * @param userId - The user ID to get friend requests for.
   * @returns - An array of FriendRequest objects.
   */
  async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    return await getDocsData<FriendRequest>(
      getPaths.sub(userId, "friendRequests"),
    );
  },

  /**
   * Gets an outgoing friend request from current user to target user.
   * @param targetUserId - The ID of the user to whom the request was sent.
   * @param currentUserId - The ID of the current user.
   * @returns - The FriendRequest object if it exists, null otherwise.
   */
  async getOutgoingFriendRequest(
    targetUserId: string,
    currentUserId: string,
  ): Promise<FriendRequest | null> {
    return await getDocData<FriendRequest>(
      getPaths.friendRequestDoc(targetUserId, currentUserId),
    );
  },

  /**
   * Listens for real-time friend updates.
   * @param userId - The user ID to listen for friend updates.
   * @param cb - Callback function to handle the updated friends array.
   * @returns - An Unsubscribe function to stop listening.
   */
  listenForFriends(
    userId: string,
    cb: (friends: Friend[]) => void,
  ): Unsubscribe {
    const friendsCol = collection(db, `users/${userId}/friends`);
    return onSnapshot(friendsCol, (snap) => {
      cb(snap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }) as Friend));
    });
  },

  /**
   * Listens for real-time friend request updates.
   * @param userId - The user ID to listen for friend request updates.
   * @param cb - Callback function to handle the updated friend requests array.
   * @returns - An Unsubscribe function to stop listening.
   */
  listenForFriendRequests(
    userId: string,
    cb: (requests: FriendRequest[]) => void,
  ): Unsubscribe {
    const reqCol = collection(db, `users/${userId}/friendRequests`);
    return onSnapshot(reqCol, (snap) => {
      cb(
        snap.docs.map(
          (doc) => ({ uid: doc.id, ...doc.data() }) as FriendRequest,
        ),
      );
    });
  },
};
