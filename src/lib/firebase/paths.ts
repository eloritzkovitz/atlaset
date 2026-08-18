import {
  doc,
  collection,
  type CollectionReference,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "./config";

export interface UserSubcollections {
  activity: import("@features/activity/types").UserActivity;
  countryLists: import("@features/atlas/countries/types").CountryList;
  friends: import("@features/user/friends/types").Friend;
  friendRequests: import("@features/user/friends/types").FriendRequest;
  layers: import("@features/atlas/layers/types").Layer;
  markers: import("@features/atlas/markers/types").Marker;
  notifications: import("@features/notifications/types").AppNotification;
  savedMaps: import("@features/atlas/savedMaps/types").SavedMap;
  sessions: import("@features/user/account/types").UserSession;
  settings: import("@features/settings/types").Settings;
  sharedTrips: import("@features/trips/types").SharedTrip;
  trips: import("@features/trips/types").Trip;
}

export const USER_SUBCOLLECTIONS: readonly (keyof UserSubcollections)[] = [
  "activity",
  "countryLists",
  "friends",
  "friendRequests",
  "layers",
  "markers",
  "notifications",
  "savedMaps",
  "sessions",
  "settings",
  "sharedTrips",
  "trips",
];

const col = <T>(...segments: string[]) =>
  collection(db, segments[0], ...segments.slice(1)) as CollectionReference<T>;
const ref = <T>(...segments: string[]) =>
  doc(db, segments[0], ...segments.slice(1)) as DocumentReference<T>;

/** Returns the paths for various Firestore collections and documents. */
export const getPaths = {
  // User document and collection references
  user: (uid: string) =>
    ref<import("@features/user/profile/types").FirestoreUser>("users", uid),
  users: () =>
    col<import("@features/user/profile/types").FirestoreUser>("users"),
  username: (name: string) => ref<{ uid: string }>("usernames", name),
  usernames: () => col<{ uid: string }>("usernames"),

  // Subcollection references
  sub: <K extends keyof UserSubcollections>(uid: string, subcollection: K) =>
    col<UserSubcollections[K]>("users", uid, subcollection),

  subDoc: <K extends keyof UserSubcollections>(
    uid: string,
    subcollection: K,
    docId: string,
  ) => ref<UserSubcollections[K]>("users", uid, subcollection, docId),

  // Specific subcollection document references
  settingsDoc: (uid: string) =>
    ref<UserSubcollections["settings"]>("users", uid, "settings", "main"),
  friendDoc: (uid: string, friendUid: string) =>
    ref<UserSubcollections["friends"]>("users", uid, "friends", friendUid),
  friendRequestDoc: (toUid: string, fromUid: string) =>
    ref<UserSubcollections["friendRequests"]>(
      "users",
      toUid,
      "friendRequests",
      fromUid,
    ),
};
