import {
  createDbMock,
  firestoreMocks,
  authMocks,
  resetAllMocks,
} from "@test-utils/mockDbAndFirestore";
import { defaultSettings } from "@constants/defaultSettings";
import { settingsService } from "./settingsService";
import { vi } from "vitest";

// IndexedDB mock
vi.mock("@utils/db", () => {
  const settingsMock = createDbMock(["get", "put"]);
  return {
    appDb: { settings: settingsMock },
    __settingsMock: settingsMock,
  };
});

// Firebase Auth/User mocks
vi.mock("@utils/firebase", () => authMocks);

// Firestore mocks
vi.mock("firebase/firestore", () => firestoreMocks);
vi.mock("../../firebase", () => ({ db: {} }));

const { __settingsMock: settingsMock } = (await import("@utils/db")) as any;
const { isAuthenticated, getCurrentUser } = await import("@utils/firebase");
const { doc, getDoc, setDoc } = await import("firebase/firestore");

describe("settingsService", () => {
  beforeEach(() => {
    resetAllMocks(settingsMock, firestoreMocks, authMocks);
  });

  it("loads settings from db if present (guest)", async () => {
    (isAuthenticated as any).mockReturnValue(false);
    const dbSettings = { id: "main", homeCountry: "US", theme: "dark" };
    settingsMock.get.mockResolvedValueOnce(dbSettings);
    const result = await settingsService.load();
    expect(result).toEqual(dbSettings);
    expect(settingsMock.get).toHaveBeenCalledWith("main");
  });

  it("returns default settings if not in db (guest)", async () => {
    (isAuthenticated as any).mockReturnValue(false);
    settingsMock.get.mockResolvedValueOnce(undefined);
    const result = await settingsService.load();
    expect(result).toEqual(defaultSettings);
  });

  it("saves settings (guest)", async () => {
    (isAuthenticated as any).mockReturnValue(false);
    const newSettings = { id: "main", homeCountry: "CA", theme: "light" };
    await settingsService.save(newSettings as any);
    expect(settingsMock.put).toHaveBeenCalledWith(newSettings);
  });

  it("loads settings from Firestore if authenticated and doc exists", async () => {
    (isAuthenticated as any).mockReturnValue(true);
    (getCurrentUser as any).mockReturnValue({ uid: "abc" });
    const docRef = {};
    (doc as any).mockReturnValue(docRef);
    const firestoreSettings = { theme: "dark", homeCountry: "GB" };
    (getDoc as any).mockResolvedValueOnce({
      exists: () => true,
      data: () => firestoreSettings,
    });
    const result = await settingsService.load();
    expect(doc).toHaveBeenCalledWith({}, "users", "abc", "settings", "main");
    expect(getDoc).toHaveBeenCalledWith(docRef);
    expect(result).toEqual({ id: "main", ...firestoreSettings });
  });

  it("returns default settings if Firestore doc does not exist", async () => {
    (isAuthenticated as any).mockReturnValue(true);
    (getCurrentUser as any).mockReturnValue({ uid: "abc" });
    const docRef = {};
    (doc as any).mockReturnValue(docRef);
    (getDoc as any).mockResolvedValueOnce({
      exists: () => false,
      data: () => ({}),
    });
    const result = await settingsService.load();
    expect(result).toEqual(defaultSettings);
  });

  it("saves settings to Firestore if authenticated", async () => {
    (isAuthenticated as any).mockReturnValue(true);
    (getCurrentUser as any).mockReturnValue({ uid: "abc" });
    const docRef = {};
    (doc as any).mockReturnValue(docRef);
    const newSettings = { id: "main", homeCountry: "CA", theme: "light" };
    await settingsService.save(newSettings as any);
    expect(doc).toHaveBeenCalledWith({}, "users", "abc", "settings", "main");
    expect(setDoc).toHaveBeenCalledWith(docRef, newSettings);
  });
});
