import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockAnalyticsControls as ac } from "@test-utils/firebaseMockRegistry";

vi.stubEnv("DEV", "" as unknown as boolean);

describe("analyticsUtils", () => {
  beforeEach(() => {
    vi.resetModules();
    ac.isSupported.mockReturnValue(true as unknown as Promise<boolean>);
  });

  describe("sanitizeDetails", () => {
    it("should remove shallow forbidden PII keys (case-insensitive)", async () => {
      const { sanitizeDetails } = await import("./analytics");
      const dirty = {
        uid: "user_123",
        EMAIL: "test@example.com",
        username: "super_explorer",
        safeKey: "safeValue",
        score: 42,
      };
      const clean = sanitizeDetails(dirty);
      expect(clean).toEqual({ safeKey: "safeValue", score: 42 });
    });

    it("should strip out raw strings that look like email addresses on any key", async () => {
      const { sanitizeDetails } = await import("./analytics");
      const dirty = {
        someArbitraryKey: "hacker@domain.com",
        anotherKey: "not-an-email",
      };
      const clean = sanitizeDetails(dirty);
      expect(clean).toEqual({ anotherKey: "not-an-email" });
    });

    it("should recursively sanitize nested objects", async () => {
      const { sanitizeDetails } = await import("./analytics");
      const dirty = {
        level1: {
          uid: "secret_123",
          nestedSafe: "keepMe",
          level2: { email: "nested@email.com", deepSafe: 100 },
        },
      };
      const clean = sanitizeDetails(dirty);
      expect(clean).toEqual({
        level1: { nestedSafe: "keepMe", level2: { deepSafe: 100 } },
      });
    });

    it("should bypass array objects without breaking or recursively scanning them", async () => {
      const { sanitizeDetails } = await import("./analytics");
      const dirty = { tags: ["travel", "geography"], numbers: [1, 2, 3] };
      const clean = sanitizeDetails(dirty);
      expect(clean).toEqual({
        tags: ["travel", "geography"],
        numbers: [1, 2, 3],
      });
    });
  });

  describe("logToGoogleAnalytics when uninitialized", () => {
    it("should not call logEvent if analytics is null/undefined", async () => {
      ac.getAnalytics.mockReturnValue("");
      const { logToGoogleAnalytics, initializeAnalytics } =
        await import("./analytics");
      await initializeAnalytics();
      logToGoogleAnalytics("test_event", { safeData: 123 });
      expect(ac.logEvent).not.toHaveBeenCalled();
    });

    it("should trigger catch block and warn if isSupported fails", async () => {
      ac.isSupported.mockRejectedValueOnce(new Error("SDK Failure"));
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      const { initializeAnalytics } = await import("./analytics");
      await initializeAnalytics();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Analytics failed to initialize:",
        expect.any(Error),
      );
    });
  });

  describe("logToGoogleAnalytics when initialized", () => {
    beforeEach(async () => {
      ac.getAnalytics.mockReturnValue({});
      const { initializeAnalytics } = await import("./analytics");
      await initializeAnalytics();
    });

    it("should sanitize details and successfully log event with actionId", async () => {
      const { logToGoogleAnalytics } = await import("./analytics");
      const details = { username: "attacker", mapId: "world_map" };

      logToGoogleAnalytics("open_map", details, 201);

      expect(ac.logEvent).toHaveBeenCalledTimes(1);
      expect(ac.logEvent).toHaveBeenCalledWith(expect.any(Object), "open_map", {
        action_id: 201,
        mapId: "world_map",
      });
    });

    it("should log event without action_id if actionId is omitted", async () => {
      const { logToGoogleAnalytics } = await import("./analytics");
      logToGoogleAnalytics("simple_event", { someData: true });

      expect(ac.logEvent).toHaveBeenCalledWith(
        expect.any(Object),
        "simple_event",
        expect.not.objectContaining({ action_id: expect.anything() }),
      );
    });

    it("should catch and log errors if logEvent throws an exception", async () => {
      const { logToGoogleAnalytics } = await import("./analytics");
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      ac.logEvent.mockImplementationOnce(() => {
        throw new Error("Firebase SDK Crash");
      });

      logToGoogleAnalytics("crash_test", {});

      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to log:",
        expect.any(Error),
      );
    });
  });
});
