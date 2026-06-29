/**
 * Utility functions for handling Firestore mocks in Vitest tests.
 */

import { vi } from "vitest";

// Mock authentication utilities
export const createAuthMocks = () => ({
  isAuthenticated: vi.fn().mockReturnValue(true),
  getCurrentUser: vi
    .fn()
    .mockReturnValue({ uid: "test-user", displayName: "Test User" }),
  getUserCollection: vi.fn(),
});

// Mock Firestore utilities
export const createFirestoreMocks = () => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  getFirestore: vi.fn(),
  limit: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  setDoc: vi.fn(),
  startAfter: vi.fn(),
  updateDoc: vi.fn(),
  where: vi.fn(),
  writeBatch: vi.fn(() => ({
    commit: vi.fn(),
    delete: vi.fn(),
    set: vi.fn(),
    update: vi.fn(),
  })),
});

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
