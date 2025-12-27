
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock dependencies before importing the service
vi.mock("@utils/db", () => {
  const settingsMock = {
    get: vi.fn(),
    count: vi.fn(),
    toArray: vi.fn(),
    clear: vi.fn(),
    add: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    bulkAdd: vi.fn(),
    bulkPut: vi.fn(),
  };
  return {
    appDb: {
      settings: settingsMock,
    },
    __esModule: true,
  };
});
vi.mock("@utils/firebase", () => {
  return {
    isAuthenticated: vi.fn(),
    getCurrentUser: vi.fn(),
    __esModule: true,
  };
});
vi.mock("firebase/firestore", () => {
  return {
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    deleteDoc: vi.fn(),
    writeBatch: vi.fn(),
    __esModule: true,
  };
});
vi.mock("@features/user", () => {
  return {
    logUserActivity: vi.fn(),
    __esModule: true,
  };
});
vi.mock("../../../firebase", () => ({
  db: {},
  __esModule: true,
}));

import { settingsService } from "./settingsService";
import { appDb } from "@utils/db";
import * as firebaseUtils from "@utils/firebase";
import * as firestore from "firebase/firestore";
import { defaultSettings } from "../constants/defaultSettings";

// Cast imported mocks to Vitest mock types
const isAuthenticatedMock = firebaseUtils.isAuthenticated as unknown as ReturnType<typeof vi.fn>;
const getCurrentUserMock = firebaseUtils.getCurrentUser as unknown as ReturnType<typeof vi.fn>;
const docMock = firestore.doc as unknown as ReturnType<typeof vi.fn>;
const getDocMock = firestore.getDoc as unknown as ReturnType<typeof vi.fn>;
const setDocMock = firestore.setDoc as unknown as ReturnType<typeof vi.fn>;

describe("settingsService", () => {
  beforeEach(() => {
    if (!appDb.settings) {
      throw new Error("appDb.settings is undefined. The mock was not set up correctly.");
    }
    Object.values(appDb.settings).forEach((fn) => (fn as { mockReset: () => void }).mockReset());
    isAuthenticatedMock.mockReset();
    getCurrentUserMock.mockReset();
    docMock.mockReset();
    getDocMock.mockReset();
    setDocMock.mockReset();
  });

  it("loads settings from db if present (guest)", async () => {
    (isAuthenticatedMock as any).mockReturnValue(false);
    const dbSettings = { id: "main", homeCountry: "US", theme: "dark" };
    (appDb.settings.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(dbSettings);
    const result = await settingsService.load();
    expect(result).toEqual(dbSettings);
    expect(appDb.settings.get).toHaveBeenCalledWith("main");
  });

  it("returns default settings if not in db (guest)", async () => {
    (isAuthenticatedMock).mockReturnValue(false);
    (appDb.settings.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);
    const result = await settingsService.load();
    expect(result).toEqual(defaultSettings);
  });

  it("saves settings (guest)", async () => {
    (isAuthenticatedMock).mockReturnValue(false);
    const newSettings = { id: "main", homeCountry: "CA", theme: "light" };
    await settingsService.save(newSettings as any);
    expect(appDb.settings.put).toHaveBeenCalledWith(newSettings);
  });

  it("loads settings from Firestore if authenticated and doc exists", async () => {
    (isAuthenticatedMock).mockReturnValue(true);
    (getCurrentUserMock).mockReturnValue({ uid: "abc" });
    const docRef = {};
    (docMock).mockReturnValue(docRef);
    const firestoreSettings = { theme: "dark", homeCountry: "GB" };
    (getDocMock).mockResolvedValueOnce({
      exists: () => true,
      data: () => firestoreSettings,
    });
    const result = await settingsService.load();
    expect(docMock).toHaveBeenCalledWith({}, "users", "abc", "settings", "main");
    expect(getDocMock).toHaveBeenCalledWith(docRef);
    expect(result).toEqual({ id: "main", ...firestoreSettings });
  });

  it("returns default settings if Firestore doc does not exist", async () => {
    (isAuthenticatedMock).mockReturnValue(true);
    (getCurrentUserMock).mockReturnValue({ uid: "abc" });
    const docRef = {};
    (docMock).mockReturnValue(docRef);
    (getDocMock).mockResolvedValueOnce({
      exists: () => false,
      data: () => ({}),
    });
    const result = await settingsService.load();
    expect(result).toEqual(defaultSettings);
  });

  it("saves settings to Firestore if authenticated", async () => {
    (isAuthenticatedMock).mockReturnValue(true);
    (getCurrentUserMock).mockReturnValue({ uid: "abc" });
    const docRef = {};
    (docMock).mockReturnValue(docRef);
    const newSettings = { id: "main", homeCountry: "CA", theme: "light" };
    await settingsService.save(newSettings as any);
    expect(docMock).toHaveBeenCalledWith({}, "users", "abc", "settings", "main");
    expect(setDocMock).toHaveBeenCalledWith(docRef, newSettings);
  });
});
