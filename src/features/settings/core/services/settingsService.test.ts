import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { appDb } from "@lib/db";
import { activityMockTracker } from "@test-utils/activityMocks";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { defaultSettings } from "../constants/defaultSettings";
import type { Settings } from "../../types";

vi.mock("@lib/db", () => ({
  appDb: {
    settings: {
      get: vi.fn(),
      put: vi.fn(),
    },
  },
  __esModule: true,
}));

describe("settingsService", () => {
  const payload: Settings = {
    ...defaultSettings,
    id: "main",
    display: { ...defaultSettings.display, theme: "dark" },
  };

  let settingsService: typeof import("./settingsService").settingsService;
  let libFirebase: typeof import("@lib/firebase");

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    const module = await import("./settingsService");
    libFirebase = await import("@lib/firebase");
    settingsService = module.settingsService;
  });

  describe("guest flow", () => {
    beforeEach(() => {
      auth.isAuthenticated.mockReturnValue(false);
      auth.getCurrentUser.mockReturnValue(null);
    });

    it("handles local table operations cleanly", async () => {
      vi.mocked(appDb.settings.get)
        .mockResolvedValueOnce(payload)
        .mockResolvedValueOnce("invalid" as any);

      expect(await settingsService.load()).toEqual(payload);
      expect(await settingsService.load()).toEqual(defaultSettings);
    });

    it("skips saving on identical payload updates", async () => {
      vi.mocked(appDb.settings.get).mockResolvedValueOnce(payload);
      await settingsService.save(payload);
      expect(appDb.settings.put).not.toHaveBeenCalled();
    });

    it("writes changes into database on differential payloads", async () => {
      vi.mocked(appDb.settings.get).mockResolvedValueOnce(payload);

      const updatedPayload: Settings = {
        ...payload,
        display: { ...payload.display, theme: "light" },
      };

      await settingsService.save(updatedPayload);
      expect(appDb.settings.put).toHaveBeenCalledTimes(1);
    });
  });

  describe("authenticated cloud workflows", () => {
    beforeEach(() => {
      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue({
        uid: "test-user",
        displayName: "Alex",
      } as any);
    });

    it("resolves from Firestore storage mapping or defaults out", async () => {
      vi.mocked(libFirebase.getDocData)
        .mockResolvedValueOnce(payload)
        .mockResolvedValueOnce(undefined);

      expect(await settingsService.load()).toEqual(payload);
      expect(await settingsService.load()).toEqual(defaultSettings);
      expect(libFirebase.getPaths.settingsDoc).toHaveBeenCalledWith(
        "test-user",
      );
    });

    it("executes atomic batch writes when saving settings", async () => {
      await settingsService.save(payload);

      expect(fs.batchSet).toHaveBeenCalledWith(
        libFirebase.getPaths.settingsDoc("test-user"),
        payload,
        { merge: true },
      );
      expect(fs.batchCommit).toHaveBeenCalledTimes(1);
      expect(activityMockTracker).toHaveBeenCalledWith(
        130,
        { settings: payload, userName: "Alex" },
        "test-user",
      );
    });

    it("synchronizes user profile privacy fields when settings.privacy is provided", async () => {
      const payloadWithPrivacy: Settings = {
        ...payload,
        privacy: {
          ...defaultSettings.privacy,
          isPublicProfile: false,
          allowSearchIndexing: true,
        },
      };

      await settingsService.save(payloadWithPrivacy);

      expect(fs.batchSet).toHaveBeenCalledWith(
        libFirebase.getPaths.settingsDoc("test-user"),
        payloadWithPrivacy,
        { merge: true },
      );
      expect(fs.batchUpdate).toHaveBeenCalledWith(
        libFirebase.getPaths.user("test-user"),
        {
          isPublic: false,
          isSearchIndexingAllowed: true,
        },
      );
      expect(fs.batchCommit).toHaveBeenCalledTimes(1);
    });

    it("omits profile document updates when privacy settings are absent", async () => {
      const payloadNoPrivacy = { ...payload };
      delete (payloadNoPrivacy as any).privacy;

      await settingsService.save(payloadNoPrivacy as Settings);

      expect(fs.batchSet).toHaveBeenCalledTimes(1);
      expect(fs.batchUpdate).not.toHaveBeenCalled();
      expect(fs.batchCommit).toHaveBeenCalledTimes(1);
    });

    it("updates only isPublic when allowSearchIndexing is undefined", async () => {
      await settingsService.save({
        ...payload,
        privacy: { isPublicProfile: false } as any,
      });

      expect(fs.batchUpdate).toHaveBeenCalledWith(
        libFirebase.getPaths.user("test-user"),
        { isPublic: false },
      );
    });

    it("updates only isSearchIndexingAllowed when isPublicProfile is undefined", async () => {
      await settingsService.save({
        ...payload,
        privacy: { allowSearchIndexing: true } as any,
      });

      expect(fs.batchUpdate).toHaveBeenCalledWith(
        libFirebase.getPaths.user("test-user"),
        { isSearchIndexingAllowed: true },
      );
    });
  });

  describe("time & concurrency deduplication filters", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue({ uid: "test-user" } as any);
    });

    afterEach(() => vi.useRealTimers());

    it("throttles high frequency document writing calls sequentially within active frame window", async () => {
      await settingsService.save(payload);
      await settingsService.save(payload);
      expect(fs.batchCommit).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(5001);
      await settingsService.save(payload);
      expect(fs.batchCommit).toHaveBeenCalledTimes(2);
    });

    it("coalesces overlapping in-flight pipeline invocations gracefully", async () => {
      let resolveWrite: (v: void) => void = () => {};
      fs.batchCommit.mockImplementationOnce(
        () => new Promise((r) => (resolveWrite = r)),
      );

      const req1 = settingsService.save(payload);
      await vi.advanceTimersByTimeAsync(0);

      const req2 = settingsService.save(payload);

      resolveWrite();
      await Promise.all([req1, req2]);

      expect(fs.batchCommit).toHaveBeenCalledTimes(1);
      expect(activityMockTracker).toHaveBeenCalledTimes(1);
    });
  });
});
