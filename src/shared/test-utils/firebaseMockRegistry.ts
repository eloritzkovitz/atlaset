import { vi } from "vitest";
import { createAuthMocks, createFirestoreMocks } from "./firestoreMocks";

export const mockAuthControls = createAuthMocks();
export const mockFirestoreControls = createFirestoreMocks();

vi.mock("@utils/firebase", () => ({
  isAuthenticated: () => mockAuthControls.isAuthenticated(),
  getCurrentUser: () => mockAuthControls.getCurrentUser(),
  getUserCollection: () => mockAuthControls.getUserCollection(),
  __esModule: true,
}));

vi.mock("firebase/firestore", () => ({
  addDoc: (...args: any[]) => mockFirestoreControls.addDoc(...args),
  collection: (...args: any[]) => mockFirestoreControls.collection(...args),
  deleteDoc: (...args: any[]) => mockFirestoreControls.deleteDoc(...args),
  doc: (...args: any[]) => mockFirestoreControls.doc(...args),
  getDoc: (...args: any[]) => mockFirestoreControls.getDoc(...args),
  getDocs: (...args: any[]) => mockFirestoreControls.getDocs(...args),
  getFirestore: (...args: any[]) => mockFirestoreControls.getFirestore(...args),
  limit: (...args: any[]) => mockFirestoreControls.limit(...args),
  orderBy: (...args: any[]) => mockFirestoreControls.orderBy(...args),
  query: (...args: any[]) => mockFirestoreControls.query(...args),
  setDoc: (...args: any[]) => mockFirestoreControls.setDoc(...args),
  startAfter: (...args: any[]) => mockFirestoreControls.startAfter(...args),
  updateDoc: (...args: any[]) => mockFirestoreControls.updateDoc(...args),
  where: (...args: any[]) => mockFirestoreControls.where(...args),
  writeBatch: () => mockFirestoreControls.writeBatch(),
  __esModule: true,
}));
