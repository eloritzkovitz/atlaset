import type {
  CollectionReference,
  DocumentReference,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { vi } from "vitest";
import {
  createAnalyticsMocks,
  createAuthMocks,
  createFirestoreMocks,
  createNativeAuthMocks,
  dbBridge,
} from "./firestoreMocks";

export const mockAnalyticsControls = createAnalyticsMocks();
export const mockAuthControls = createAuthMocks();
export const mockNativeAuthControls = createNativeAuthMocks();
export const mockFirestoreControls = createFirestoreMocks();

dbBridge.collection = mockFirestoreControls.collection;

// Auto-wire doc paths into custom reference shapes globally
vi.spyOn(mockFirestoreControls, "doc").mockImplementation(
  (colRef: unknown, id: string) => {
    return { colRef, id, type: "document" };
  },
);

// Mock Firebase utilities
vi.mock("@lib/firebase", () => ({
  auth: mockNativeAuthControls.auth,
  isAuthenticated: () => mockAuthControls.isAuthenticated(),
  getCurrentUser: () => mockAuthControls.getCurrentUser(),
  getCollection: () => mockFirestoreControls.collection,
  getUserCollection: mockAuthControls.getUserCollection,
  logToGoogleAnalytics: vi.fn(),
  getDocData: vi.fn(async (ref: DocumentReference) => {
    const lookupKey = ref?.id ? { id: ref.id } : ref;
    const snap = await mockFirestoreControls.getDoc(lookupKey);
    if (!snap || (typeof snap.exists === "function" && !snap.exists())) {
      return null;
    }
    const data = typeof snap.data === "function" ? snap.data() : snap.data;
    return { id: ref?.id, ...data };
  }),
  getDocsData: vi.fn(async (colRef: CollectionReference) => {
    const snap = await mockFirestoreControls.getDocs(colRef);
    if (!snap || !snap.docs) return [];
    return snap.docs.map((d: QueryDocumentSnapshot) => {
      const data = typeof d.data === "function" ? d.data() : d.data;
      return { id: d.id, ...data };
    });
  }),

  USER_SUBCOLLECTIONS: [
    "activity",
    "friends",
    "friendRequests",
    "notifications",
  ],

  getPaths: {
    user: vi.fn((uid) => mockFirestoreControls.doc({}, `users/${uid}`)),
    username: vi.fn((username) =>
      mockFirestoreControls.doc({}, `usernames/${username}`),
    ),
    usernames: vi.fn(() => mockFirestoreControls.collection({}, "usernames")),
    sub: vi.fn((uid, sub) =>
      mockFirestoreControls.collection({}, `users/${uid}/${sub}`),
    ),
    subDoc: vi.fn((uid, sub, docId) =>
      mockFirestoreControls.doc({}, `users/${uid}/${sub}/${docId}`),
    ),
    settingsDoc: vi.fn((uid) =>
      mockFirestoreControls.doc({}, `users/${uid}/settings/main`),
    ),
    friendDoc: vi.fn((uid, friendUid) =>
      mockFirestoreControls.doc({}, `users/${uid}/friends/${friendUid}`),
    ),
    friendRequestDoc: vi.fn((toUid, fromUid) =>
      mockFirestoreControls.doc({}, `users/${toUid}/friendRequests/${fromUid}`),
    ),
  },

  db: {},

  __esModule: true,
}));

// Mock Google Analytics utilities
vi.mock("firebase/analytics", () => ({
  getAnalytics: () => mockAnalyticsControls.getAnalytics(),
  isSupported: () => mockAnalyticsControls.isSupported(),
  logEvent: (...args: unknown[]) => mockAnalyticsControls.logEvent(...args),
  __esModule: true,
}));

// Mock Firebase Auth utilities
vi.mock("firebase/auth", () => ({
  getAuth: () => mockNativeAuthControls.getAuth(),
  auth: mockNativeAuthControls.auth,
  browserLocalPersistence: mockNativeAuthControls.browserLocalPersistence,
  browserSessionPersistence: mockNativeAuthControls.browserSessionPersistence,
  signInWithEmailAndPassword: mockNativeAuthControls.signInWithEmailAndPassword,
  signOut: mockNativeAuthControls.signOut,
  setPersistence: mockNativeAuthControls.setPersistence,
  createUserWithEmailAndPassword:
    mockNativeAuthControls.createUserWithEmailAndPassword,
  sendPasswordResetEmail: mockNativeAuthControls.sendPasswordResetEmail,
  updateProfile: mockNativeAuthControls.updateProfile,
  signInWithPopup: mockNativeAuthControls.signInWithPopup,
  deleteUser: mockNativeAuthControls.deleteUser,
  GoogleAuthProvider: mockNativeAuthControls.GoogleAuthProvider,
  __esModule: true,
}));

// Mock Firestore utilities
vi.mock("firebase/firestore", async () => {
  const actual =
    await vi.importActual<typeof import("firebase/firestore")>(
      "firebase/firestore",
    );

  return {
    ...actual,
    addDoc: mockFirestoreControls.addDoc,
    arrayRemove: mockFirestoreControls.arrayRemove,
    arrayUnion: mockFirestoreControls.arrayUnion,
    batchCommit: mockFirestoreControls.batchCommit,
    batchSet: mockFirestoreControls.batchSet,
    batchUpdate: mockFirestoreControls.batchUpdate,
    collection: mockFirestoreControls.collection,
    deleteDoc: mockFirestoreControls.deleteDoc,
    doc: mockFirestoreControls.doc,
    getDoc: mockFirestoreControls.getDoc,
    getDocs: mockFirestoreControls.getDocs,
    getFirestore: mockFirestoreControls.getFirestore,
    limit: mockFirestoreControls.limit,
    onSnapshot: mockFirestoreControls.onSnapshot,
    orderBy: mockFirestoreControls.orderBy,
    query: mockFirestoreControls.query,
    runTransaction: mockFirestoreControls.runTransaction,
    serverTimestamp: mockFirestoreControls.serverTimestamp,
    setDoc: mockFirestoreControls.setDoc,
    startAfter: mockFirestoreControls.startAfter,
    transaction: mockFirestoreControls.transaction,
    updateDoc: mockFirestoreControls.updateDoc,
    where: mockFirestoreControls.where,
    writeBatch: () => mockFirestoreControls.writeBatch(),
    __esModule: true,
  };
});
