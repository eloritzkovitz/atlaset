/**
 * Utility functions for handling Firestore mocks in Vitest tests.
 */

import { vi } from "vitest";
import { authState } from "./authMocks";

export const dbBridge = {
  collection: vi.fn(),
};

// Mock Google Analytics utilities
export const createAnalyticsMocks = () => ({
  logEvent: vi.fn(),
  isSupported: vi.fn(async () => true),
  getAnalytics: vi.fn(() => ({})),
});

// Mock authentication utilities
export const createAuthMocks = () => ({
  isAuthenticated: vi.fn(() => authState.currentUser !== null),
  getCurrentUser: vi.fn(() => authState.currentUser),
  getUserCollection: vi.fn((subcollection: string) => {
    if (!authState.currentUser) {
      throw new Error("User is not authenticated");
    }
    return dbBridge.collection(subcollection);
  }),
});

// Mock native Firebase Auth methods
export const createNativeAuthMocks = () => ({
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(() => {
    authState.currentUser = null;
    return Promise.resolve();
  }),
  setPersistence: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  updateProfile: vi.fn(),
  signInWithPopup: vi.fn(),
  deleteUser: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  getAuth: vi.fn(() => authState),
  auth: authState,
  browserLocalPersistence: "local",
  browserSessionPersistence: "session",
});

// Mock Firestore utilities
export const createFirestoreMocks = () => {
  const batchCommit = vi.fn().mockResolvedValue(undefined);
  const batchSet = vi.fn();
  const batchUpdate = vi.fn();
  const deleteDoc = vi.fn();

  return {
    addDoc: vi.fn(),
    arrayRemove: vi.fn(),
    arrayUnion: vi.fn(),
    batchCommit,
    batchSet,
    batchUpdate,
    collection: vi.fn(),
    deleteDoc,
    doc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    getFirestore: vi.fn(),
    limit: vi.fn(),
    onSnapshot: vi.fn(),
    orderBy: vi.fn(),
    query: vi.fn(),
    serverTimestamp: vi.fn(() => ({ toMillis: () => Date.now() })),
    setDoc: vi.fn(),
    startAfter: vi.fn(),
    transaction: vi.fn(() => ({
      get: vi.fn(),
      set: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    })),
    updateDoc: vi.fn(),
    where: vi.fn(),
    writeBatch: vi.fn(() => ({
      set: (...args: any[]) => batchSet(...args),
      update: (...args: any[]) => batchUpdate(...args),
      delete: (...args: any[]) => deleteDoc(...args),
      commit: (...args: any[]) => batchCommit(...args),
    })),
  };
};

/**
 * Creates a mock database object with specified methods.
 * @param methods - An array of method names to mock on the database object.
 * @returns A mock database object with the specified methods mocked.
 */
export function createDbMock(methods: string[]) {
  const mock = {};
  methods.forEach((method) => {
    (mock as any)[method] = vi.fn();
  });
  return mock;
}

/**
 * Generates a mock Firestore QuerySnapshot structure for Vitest assertion chains.
 * @param docs - An array of objects representing the documents in the snapshot.
 * Each object should have an `id`, `data`, and optionally a `ref`.
 * @returns A mock QuerySnapshot object with the specified documents.
 */
export function createMockSnapshot(
  docs: Array<{ id: string; data: object; ref?: any }>,
) {
  return {
    docs: docs.map((d) => ({
      id: d.id,
      data: () => d.data,
      ref: d.ref || { id: d.id },
    })),
    empty: docs.length === 0,
    size: docs.length,
  };
}

/**
 * Creates a mock Firestore document snapshot for testing purposes.
 * @param exists - A boolean indicating whether the document exists.
 * @param dataObj - An optional object representing the data of the document.
 * @returns A mock document snapshot with the specified existence and data.
 */
export function createMockDocSnap(exists: boolean, dataObj: object = {}) {
  return {
    exists: () => exists,
    id: "mock-doc-id",
    data: () => dataObj,
  };
}

/**
 * Resets all mocks in the provided mock objects.
 * @param mocks - An array of mock objects whose functions should be reset.
 */
export const resetAllMocks = (...mockContainers: any[]) => {
  mockContainers.forEach((container) => {
    Object.values(container).forEach((mockFn: any) => {
      if (typeof mockFn?.mockReset === "function") {
        mockFn.mockReset();
      }
    });
  });
};
