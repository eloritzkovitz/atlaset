import { vi } from "vitest";
import { firestoreMocks, authMocks, createDbMock } from "./mockDbAndFirestore";
import { commonDbMethods } from "@constants/dbMethods";

// Create and export mock objects for use in tests
export const markersMock = createDbMock(commonDbMethods);
export const overlaysMock = createDbMock(commonDbMethods);
export const tripsMock = createDbMock(commonDbMethods);
export const settingsMock = createDbMock(["get", "put"]);

export function mockIndexedDb() {
  vi.mock("@utils/db", () => ({
    appDb: {
      markers: markersMock,
      overlays: overlaysMock,
      trips: tripsMock,
      settings: settingsMock,
    },
    __markersMock: markersMock,
    __overlaysMock: overlaysMock,
    __tripsMock: tripsMock,
    __settingsMock: settingsMock,
  }));
}

// Firebase Auth/User mocks
export function mockFirebaseUtils() {
  vi.mock("@utils/firebase", () => ({
    ...authMocks,
    logUserActivity: vi.fn(),
    getUserCollection: vi.fn(),
    isAuthenticated: vi.fn(() => true),
    getCurrentUser: vi.fn(() => ({
      uid: "testuid",
      displayName: "Test User",
      email: "test@example.com",
    })),
  }));
}

// Firestore mocks
export function mockFirestore() {
  vi.mock("firebase/firestore", () => ({
    ...firestoreMocks,
    getFirestore: vi.fn(() => ({})),
    getDocs: vi.fn(async () => ({
      docs: [
        {
          id: "testid",
          data: () => ({ name: "Test Name", location: "Test Location" }),
        },
      ],
    })),
    setDoc: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(),
    collection: vi.fn(),
  }));
  vi.mock("../../firebase", () => ({
    db: {},
    getFirestore: vi.fn(() => ({})),
  }));
}
