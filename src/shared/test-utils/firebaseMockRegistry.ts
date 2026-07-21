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
vi.spyOn(mockFirestoreControls, "doc").mockImplementation(((
  colRef: any,
  id: string,
) => {
  return { colRef, id, type: "document" };
}) as any);

// Mock Firebase utilities
vi.mock("@lib/firebase", () => ({
  isAuthenticated: () => mockAuthControls.isAuthenticated(),
  getCurrentUser: () => mockAuthControls.getCurrentUser(),
  getCollection: () => mockFirestoreControls.collection,
  getUserCollection: mockAuthControls.getUserCollection,
  logToGoogleAnalytics: vi.fn(),
  getDocData: vi.fn(async (ref: any) => {
    const lookupKey = ref?.id ? { id: ref.id } : ref;
    const snap = await mockFirestoreControls.getDoc(lookupKey);
    if (!snap || (typeof snap.exists === "function" && !snap.exists())) {
      return null;
    }
    const data = typeof snap.data === "function" ? snap.data() : snap.data;
    return { id: ref?.id, ...data };
  }),
  getDocsData: vi.fn(async (colRef: any) => {
    const snap = await mockFirestoreControls.getDocs(colRef);
    if (!snap || !snap.docs) return [];
    return snap.docs.map((d: any) => {
      const data = typeof d.data === "function" ? d.data() : d.data;
      return { id: d.id, ...data };
    });
  }),
  getPaths: {
    user: vi.fn((uid) => mockFirestoreControls.doc({} as any, `users/${uid}`)),
    username: vi.fn((username) =>
      mockFirestoreControls.doc({} as any, `usernames/${username}`),
    ),
    sub: vi.fn((uid, sub) =>
      mockFirestoreControls.collection({} as any, `users/${uid}/${sub}`),
    ),
    subDoc: vi.fn((uid, sub, docId) =>
      mockFirestoreControls.doc({} as any, `users/${uid}/${sub}/${docId}`),
    ),
    settingsDoc: vi.fn((uid) =>
      mockFirestoreControls.doc({} as any, `users/${uid}/settings/main`),
    ),
    friendDoc: vi.fn((uid, friendUid) =>
      mockFirestoreControls.doc({} as any, `users/${uid}/friends/${friendUid}`),
    ),
    friendRequestDoc: vi.fn((toUid, fromUid) =>
      mockFirestoreControls.doc(
        {} as any,
        `users/${toUid}/friendRequests/${fromUid}`,
      ),
    ),
  },
  db: {},
  __esModule: true,
}));

// Mock Google Analytics utilities
vi.mock("firebase/analytics", () => ({
  getAnalytics: () => mockAnalyticsControls.getAnalytics(),
  isSupported: () => mockAnalyticsControls.isSupported(),
  logEvent: (...args: any[]) => mockAnalyticsControls.logEvent(...args),
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

/** Mocks timestamp utilities. */
export const mockTimestamp = {
  now: vi.fn(() => ({ toMillis: () => 1000 })),
  fromDate: vi.fn((d) => ({ toMillis: () => d.getTime() })),
};

// Mock Firestore utilities
vi.mock("firebase/firestore", () => ({
  addDoc: mockFirestoreControls.addDoc,
  arrayRemove: mockFirestoreControls.arrayRemove,
  arrayUnion: mockFirestoreControls.arrayUnion,
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
  runTransaction: vi.fn((_db, cb) => cb(mockFirestoreControls.transaction())),
  serverTimestamp: mockFirestoreControls.serverTimestamp,
  setDoc: mockFirestoreControls.setDoc,
  startAfter: mockFirestoreControls.startAfter,
  transaction: mockFirestoreControls.transaction,
  updateDoc: mockFirestoreControls.updateDoc,
  where: mockFirestoreControls.where,
  writeBatch: () => mockFirestoreControls.writeBatch(),
  Timestamp: mockTimestamp,
  __esModule: true,
}));
