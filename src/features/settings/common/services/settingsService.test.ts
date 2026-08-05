import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { appDb } from "@lib/db";
import { activityMockTracker } from "@test-utils/activityMocks";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { defaultSettings } from "../constants/defaultSettings";

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
  const payload = { id: "main", theme: "dark", homeCountry: "US" };
  let settingsService: any;
  let libFirebase: any;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    const module = await import("./settingsService");
    libFirebase = await import("@lib/firebase");
    settingsService = module.settingsService;
  });

  describe("guest flow", () => {
    beforeEach(() => auth.isAuthenticated.mockReturnValue(false));

    it("handles local table operations cleanly", async () => {
      vi.mocked(appDb.settings.get)
        .mockResolvedValueOnce(payload)
        .mockResolvedValueOnce("invalid" as any);

      expect(await settingsService.load()).toEqual(payload);
      expect(await settingsService.load()).toEqual(defaultSettings);
    });

    it.each([
      ["skips saving on identical payload updates", payload, false],
      [
        "writes changes into database on differential payloads",
        { id: "main", theme: "light" },
        true,
      ],
    ])("%s", async (_, targetPayload, shouldWrite) => {
      vi.mocked(appDb.settings.get).mockResolvedValueOnce(payload);
      await settingsService.save(targetPayload as any);
      expect(appDb.settings.put).toHaveBeenCalledTimes(shouldWrite ? 1 : 0);
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
      await settingsService.save(payload as any);

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
      const payloadWithPrivacy = {
        ...payload,
        privacy: {
          isPublicProfile: false,
          allowSearchIndexing: true,
        },
      };

      await settingsService.save(payloadWithPrivacy as any);

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
      await settingsService.save(payload as any);

      expect(fs.batchSet).toHaveBeenCalledTimes(1);
      expect(fs.batchUpdate).not.toHaveBeenCalled();
      expect(fs.batchCommit).toHaveBeenCalledTimes(1);
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
      await settingsService.save(payload as any);
      await settingsService.save(payload as any);
      expect(fs.batchCommit).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(5001);
      await settingsService.save(payload as any);
      expect(fs.batchCommit).toHaveBeenCalledTimes(2);
    });

    it("coalesces overlapping in-flight pipeline invocations gracefully", async () => {
      let resolveWrite: (v: void) => void = () => {};
      fs.batchCommit.mockImplementationOnce(
        () => new Promise((r) => (resolveWrite = r)),
      );

      const req1 = settingsService.save(payload as any);
      await vi.advanceTimersByTimeAsync(0);

      const req2 = settingsService.save(payload as any);

      resolveWrite();
      await Promise.all([req1, req2]);

      expect(fs.batchCommit).toHaveBeenCalledTimes(1);
      expect(activityMockTracker).toHaveBeenCalledTimes(1);
    });
  });
});
