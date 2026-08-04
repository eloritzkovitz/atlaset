import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getBrowserSessionInfo,
  getOrCreateSessionId,
  isCurrentSession,
  clearLocalSession,
} from "./session";

describe("session utils", () => {
  const EXPECTED_KEY = "atlaset:sessionId";

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("getBrowserSessionInfo", () => {
    it("gathers accurate environment specs from browser globals", () => {
      vi.stubGlobal("navigator", { userAgent: "TestAgent", language: "en-US" });
      vi.spyOn(window.screen, "width", "get").mockReturnValue(1920);
      vi.spyOn(window.screen, "height", "get").mockReturnValue(1080);

      expect(getBrowserSessionInfo()).toEqual({
        userAgent: "TestAgent",
        language: "en-US",
        screen: "1920x1080",
      });
    });
  });

  describe("getOrCreateSessionId", () => {
    it("generates a new UUID and stores it when session is empty", () => {
      const mockUuid = "11111111-2222-3333-4444-555555555555";
      vi.stubGlobal("crypto", { randomUUID: () => mockUuid });

      expect(getOrCreateSessionId()).toBe(mockUuid);
      expect(localStorage.getItem(EXPECTED_KEY)).toBe(JSON.stringify(mockUuid));
    });

    it("returns existing session ID without generating a new UUID", () => {
      const existingId = "existing-uuid-9999";
      localStorage.setItem(EXPECTED_KEY, JSON.stringify(existingId));

      const cryptoSpy = vi.fn();
      vi.stubGlobal("crypto", { randomUUID: cryptoSpy });

      expect(getOrCreateSessionId()).toBe(existingId);
      expect(cryptoSpy).not.toHaveBeenCalled();
    });

    it("falls back to Math.random generator when crypto or randomUUID is undefined", () => {
      vi.stubGlobal("crypto", {});

      const id = getOrCreateSessionId();

      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe("isCurrentSession", () => {
    it("validates whether a given ID matches the active session", () => {
      const activeId = "session-123";
      localStorage.setItem(EXPECTED_KEY, JSON.stringify(activeId));

      expect(isCurrentSession(activeId)).toBe(true);
      expect(isCurrentSession("wrong-id")).toBe(false);
      expect(isCurrentSession(undefined)).toBe(false);
    });
  });

  describe("clearLocalSession", () => {
    it("removes the session token from storage", () => {
      localStorage.setItem(EXPECTED_KEY, JSON.stringify("temp-token"));

      clearLocalSession();

      expect(localStorage.getItem(EXPECTED_KEY)).toBeNull();
    });
  });
});
