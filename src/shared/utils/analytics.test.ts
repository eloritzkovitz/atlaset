import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { mockAnalyticsControls as ac } from "@test-utils/firebaseMockRegistry";

vi.stubEnv("DEV", "" as unknown as boolean);

let sanitizeDetails: typeof import("./analytics").sanitizeDetails;
let logToGoogleAnalytics: typeof import("./analytics").logToGoogleAnalytics;

describe("analyticsUtils", () => {
  beforeAll(async () => {
    vi.resetModules();
    const utils = await import("./analytics");
    sanitizeDetails = utils.sanitizeDetails;
    logToGoogleAnalytics = utils.logToGoogleAnalytics;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    ac.getAnalytics.mockReturnValue({});
  });

  describe("sanitizeDetails", () => {
    it("should remove shallow forbidden PII keys (case-insensitive)", () => {
      const dirty = {
        uid: "user_123",
        EMAIL: "test@example.com",
        username: "super_explorer",
        safeKey: "safeValue",
        score: 42,
      };

      const clean = sanitizeDetails(dirty);

      expect(clean).toEqual({
        safeKey: "safeValue",
        score: 42,
      });
      expect(clean.uid).toBeUndefined();
      expect(clean.EMAIL).toBeUndefined();
      expect(clean.username).toBeUndefined();
    });

    it("should strip out raw strings that look like email addresses on any key", () => {
      const dirty = {
        someArbitraryKey: "hacker@domain.com",
        anotherKey: "not-an-email",
        trickyAlmostEmail: "almost@email",
      };

      const clean = sanitizeDetails(dirty);

      expect(clean).toEqual({
        anotherKey: "not-an-email",
        trickyAlmostEmail: "almost@email",
      });
    });

    it("should recursively sanitize nested objects", () => {
      const dirty = {
        level1: {
          uid: "secret_123",
          nestedSafe: "keepMe",
          level2: {
            email: "nested@email.com",
            deepSafe: 100,
          },
        },
      };

      const clean = sanitizeDetails(dirty);

      expect(clean).toEqual({
        level1: {
          nestedSafe: "keepMe",
          level2: {
            deepSafe: 100,
          },
        },
      });
    });

    it("should bypass array objects without breaking or recursively scanning them", () => {
      const dirty = {
        tags: ["travel", "geography"],
        numbers: [1, 2, 3],
      };

      const clean = sanitizeDetails(dirty);

      expect(clean).toEqual({
        tags: ["travel", "geography"],
        numbers: [1, 2, 3],
      });
    });
  });

  describe("logToGoogleAnalytics", () => {
    it("should not call logEvent if analytics is null/undefined", async () => {
      vi.resetModules();
      ac.getAnalytics.mockReturnValue("");

      const { logToGoogleAnalytics: localLogToGoogleAnalytics } =
        await import("./analytics");
      localLogToGoogleAnalytics("test_event", { safeData: 123 });

      expect(ac.logEvent).not.toHaveBeenCalled();
    });

    it("should sanitize details and successfully log event with actionId", () => {
      const details = {
        username: "attacker",
        mapId: "world_map",
      };

      logToGoogleAnalytics("open_map", details, 201);

      expect(ac.logEvent).toHaveBeenCalledTimes(1);
      expect(ac.logEvent).toHaveBeenCalledWith(expect.any(Object), "open_map", {
        action_id: 201,
        mapId: "world_map",
      });

      const sentPayload = vi.mocked(ac.logEvent).mock.calls[0][2];
      expect(sentPayload?.username).toBeUndefined();
    });

    it("should log event without action_id if actionId is omitted", () => {
      logToGoogleAnalytics("simple_event", { someData: true });

      expect(ac.logEvent).toHaveBeenCalledWith(
        expect.any(Object),
        "simple_event",
        expect.not.objectContaining({ action_id: expect.anything() }),
      );
    });

    it("should catch and log errors if logEvent throws an exception", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      vi.mocked(ac.logEvent).mockImplementationOnce(() => {
        throw new Error("Firebase SDK Crash");
      });

      expect(() => {
        logToGoogleAnalytics("crash_test", {});
      }).not.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to log to Google Analytics:",
        expect.any(Error),
      );
    });
  });
});
