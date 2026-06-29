import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { appDb } from "@app/db";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { settingsService } from "./settingsService";
import { defaultSettings } from "../constants/defaultSettings";
import { logUserActivity } from "../../../user";

vi.mock("@app/db", () => ({
  appDb: {
    settings: {
      get: vi.fn(),
      put: vi.fn(),
    },
  },
  __esModule: true,
}));

vi.mock("../../../user", () => ({
  logUserActivity: vi.fn(),
  __esModule: true,
}));

vi.mock("@app/firebase", () => ({
  db: {},
  __esModule: true,
}));

describe("settingsService", () => {
  const mockDocRef = { type: "firestore-doc-ref" };

  beforeEach(() => {
    vi.clearAllMocks();
    fs.doc.mockReturnValue(mockDocRef as any);
  });

  describe("guest flow (unauthenticated)", () => {
    beforeEach(() => {
      auth.isAuthenticated.mockReturnValue(false);
    });

    it("loads settings from local db if present", async () => {
      const dbSettings = { id: "main", homeCountry: "US", theme: "dark" };
      vi.mocked(appDb.settings.get).mockResolvedValueOnce(dbSettings);

      const result = await settingsService.load();

      expect(result).toEqual(dbSettings);
      expect(appDb.settings.get).toHaveBeenCalledWith("main");
    });

    it("returns default settings if local db returns invalid/non-object types", async () => {
      vi.mocked(appDb.settings.get).mockResolvedValueOnce(
        "invalid_string_or_no_id" as any,
      );
      const result = await settingsService.load();
      expect(result).toEqual(defaultSettings);
    });

    it("skips saving to IndexedDB if incoming settings match existing local data", async () => {
      const currentSettings = { id: "main", theme: "dark" };
      vi.mocked(appDb.settings.get).mockResolvedValueOnce(currentSettings);

      await settingsService.save(currentSettings as any);

      expect(appDb.settings.put).not.toHaveBeenCalled();
    });

    it("saves settings directly to local IndexedDB if they changed", async () => {
      const oldSettings = { id: "main", theme: "dark" };
      const newSettings = { id: "main", theme: "light" };
      vi.mocked(appDb.settings.get).mockResolvedValueOnce(oldSettings);

      await settingsService.save(newSettings as any);

      expect(appDb.settings.put).toHaveBeenCalledWith(newSettings);
    });
  });

  describe("cloud syncing flow (authenticated) - Core Branch Coverage", () => {
    beforeEach(() => {
      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue({
        uid: "test-user",
        displayName: "Alex",
      } as any);
    });

    it("loads settings from lifestyle Firestore document if it exists", async () => {
      const firestoreSettings = { theme: "dark", homeCountry: "GB" };
      fs.getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => firestoreSettings,
      } as any);

      const result = await settingsService.load();

      expect(fs.doc).toHaveBeenCalledWith(
        {},
        "users",
        "test-user",
        "settings",
        "main",
      );
      expect(fs.getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toEqual({ id: "main", ...firestoreSettings });
    });

    it("falls back to default settings if cloud document does not exist", async () => {
      fs.getDoc.mockResolvedValueOnce({
        exists: () => false,
      } as any);
      const result = await settingsService.load();
      expect(result).toEqual(defaultSettings);
    });

    it("skips write completely if incoming data matches current Firestore persistence", async () => {
      const identicalPayload = { id: "main", theme: "orange" };
      fs.getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ theme: "orange" }),
      } as any);

      await settingsService.save(identicalPayload as any);

      expect(fs.setDoc).not.toHaveBeenCalled();
      expect(logUserActivity).not.toHaveBeenCalled();
    });
  });

  describe("cloud syncing flow (authenticated) - Time & Concurrency Deduplication", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue({
        uid: "test-user",
        displayName: "Alex",
      } as any);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("deduplicates fast back-to-back saves within the 5000ms window, but allows them after expiry", async () => {
      const settingsPayload = { id: "main", theme: "neon" };

      fs.getDoc.mockResolvedValue({ exists: () => false } as any);

      await settingsService.save(settingsPayload as any);
      expect(fs.setDoc).toHaveBeenCalledTimes(1);

      await settingsService.save(settingsPayload as any);
      expect(fs.setDoc).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(5001);

      await settingsService.save(settingsPayload as any);
      expect(fs.setDoc).toHaveBeenCalledTimes(2);
    });

    it("coalesces matching concurrent in-flight save operations and registers logs correctly", async () => {
      const concurrentSettings = { id: "main", theme: "cyberpunk" };

      let resolveGetDoc: (value: any) => void = () => {};
      const firstGetDocPromise = new Promise((resolve) => {
        resolveGetDoc = resolve;
      });

      fs.getDoc
        .mockReturnValueOnce(firstGetDocPromise as any)
        .mockResolvedValue({ exists: () => false } as any);

      let resolveSetDoc: (value: void) => void = () => {};
      const setDocPromise = new Promise<void>((resolve) => {
        resolveSetDoc = resolve;
      });
      fs.setDoc.mockReturnValueOnce(setDocPromise);

      const call1 = settingsService.save(concurrentSettings as any);

      resolveGetDoc({ exists: () => false });

      await Promise.resolve();

      const call2 = settingsService.save(concurrentSettings as any);

      resolveSetDoc();
      await Promise.all([call1, call2]);

      expect(fs.setDoc).toHaveBeenCalledTimes(1);
      expect(logUserActivity).toHaveBeenCalledTimes(1);
    });
  });
});
