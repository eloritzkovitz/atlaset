import { describe, it, expect, vi, beforeEach } from "vitest";
import { analytics } from "@app/firebase";
import { logEvent } from "firebase/analytics";
import { sanitizeDetails, logToGoogleAnalytics } from "./analytics";

const firebaseMock = {
  analytics: {} as any,
};

vi.mock("firebase/analytics", () => ({
  logEvent: vi.fn(),
}));

vi.mock("@app/firebase", () => ({
  get analytics() {
    return firebaseMock.analytics;
  },
}));

describe("analyticsUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firebaseMock.analytics = {};
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
    it("should not call logEvent if analytics is null/undefined", () => {
      firebaseMock.analytics = null;

      logToGoogleAnalytics("test_event", { safeData: 123 });

      expect(logEvent).not.toHaveBeenCalled();
    });

    it("should sanitize details and successfully log event with actionId", () => {
      const details = {
        username: "attacker",
        mapId: "world_map",
      };

      logToGoogleAnalytics("open_map", details, 201);

      expect(logEvent).toHaveBeenCalledTimes(1);
      expect(logEvent).toHaveBeenCalledWith(
        analytics,
        "open_map",
        expect.objectContaining({
          mapId: "world_map",
          action_id: 201,
        }),
      );

      const sentPayload = vi.mocked(logEvent).mock.calls[0][2];
      expect(sentPayload?.username).toBeUndefined();
    });

    it("should log event without action_id if actionId is omitted", () => {
      logToGoogleAnalytics("simple_event", { someData: true });

      expect(logEvent).toHaveBeenCalledWith(
        analytics,
        "simple_event",
        expect.not.objectContaining({ action_id: expect.anything() }),
      );
    });

    it("should catch and log errors if logEvent throws an exception", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      vi.mocked(logEvent).mockImplementationOnce(() => {
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
