import { vi } from "vitest";
import {
  createAuthMocks,
  createFirestoreMocks,
  createNativeAuthMocks,
  dbBridge,
} from "./firestoreMocks";

export const mockAuthControls = createAuthMocks();
export const mockNativeAuthControls = createNativeAuthMocks();
export const mockFirestoreControls = createFirestoreMocks();

dbBridge.collection = mockFirestoreControls.collection;

vi.mock("@utils/firebase", () => ({
  isAuthenticated: () => mockAuthControls.isAuthenticated(),
  getCurrentUser: () => mockAuthControls.getCurrentUser(),
  getUserCollection: mockAuthControls.getUserCollection,
  __esModule: true,
}));

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
  setDoc: mockFirestoreControls.setDoc,
  startAfter: mockFirestoreControls.startAfter,
  updateDoc: mockFirestoreControls.updateDoc,
  where: mockFirestoreControls.where,
  writeBatch: () => mockFirestoreControls.writeBatch(),
  __esModule: true,
}));
