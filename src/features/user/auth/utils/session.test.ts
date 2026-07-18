import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getBrowserSessionInfo,
  getOrCreateSessionId,
  isCurrentSession,
  clearLocalSession,
} from "./session";

const SESSION_KEY = "testSessionId";

describe("session utils", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("getBrowserSessionInfo", () => {
    it("gathers accurate environment specs from navigator and window globals", () => {
      vi.stubGlobal("navigator", {
        userAgent: "TestAgent/1.0",
        language: "fr-FR",
      });
      vi.stubGlobal("window", {
        screen: {
          width: 2560,
          height: 1440,
        },
      });

      const info = getBrowserSessionInfo();

      expect(info).toEqual({
        userAgent: "TestAgent/1.0",
        language: "fr-FR",
        screen: "2560x1440",
      });
    });
  });

  describe("getOrCreateSessionId", () => {
    it("generates and registers a fresh UUID token when localStorage cache is empty", () => {
      const mockUuid = "11111111-2222-3333-4444-555555555555";
      vi.stubGlobal("crypto", {
        randomUUID: vi.fn(() => mockUuid),
      });

      const spyGet = vi.spyOn(Storage.prototype, "getItem");
      const spySet = vi.spyOn(Storage.prototype, "setItem");

      const id = getOrCreateSessionId();

      expect(id).toBe(mockUuid);
      expect(spyGet).toHaveBeenCalledWith(SESSION_KEY);
      expect(spySet).toHaveBeenCalledWith(SESSION_KEY, mockUuid);
    });

    it("pulls the existing identifier from the local store instead of creating a new one", () => {
      const existingId = "existing-uuid-9999";
      localStorage.setItem(SESSION_KEY, existingId);

      const cryptoSpy = vi.fn();
      vi.stubGlobal("crypto", { randomUUID: cryptoSpy });

      const id = getOrCreateSessionId();

      expect(id).toBe(existingId);
      expect(cryptoSpy).not.toHaveBeenCalled();
    });
  });

  describe("isCurrentSession", () => {
    it("returns true when evaluated against the matching storage string value", () => {
      const targetId = "match-me-1234";
      localStorage.setItem(SESSION_KEY, targetId);

      expect(isCurrentSession(targetId)).toBe(true);
    });

    it("returns false when provided an alternate or missing comparison string identifier", () => {
      localStorage.setItem(SESSION_KEY, "match-me-1234");

      expect(isCurrentSession("mismatched-id-5678")).toBe(false);
      expect(isCurrentSession(undefined)).toBe(false);
    });
  });

  describe("clearLocalSession", () => {
    it("purges targeted session keys cleanly from storage namespaces", () => {
      localStorage.setItem(SESSION_KEY, "temp-token");
      const spyRemove = vi.spyOn(Storage.prototype, "removeItem");

      clearLocalSession();

      expect(localStorage.getItem(SESSION_KEY)).toBeNull();
      expect(spyRemove).toHaveBeenCalledWith(SESSION_KEY);
    });
  });
});
