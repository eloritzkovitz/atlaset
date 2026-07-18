import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  getBrowserSessionInfo,
  getOrCreateSessionId,
  isCurrentSession,
  clearLocalSession,
} from "./session";

describe("session utils", () => {
  let store: Record<string, string>;
  const EXPECTED_KEY = "atlaset:sessionId";

  beforeEach(() => {
    vi.restoreAllMocks();
    store = {};

    const localStorageMock = {
      getItem: vi.fn((key: string): string | null => store[key] || null),
      setItem: vi.fn((key: string, value: string): void => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string): void => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      length: 0,
      key: vi.fn(() => null),
    };

    vi.stubGlobal("localStorage", localStorageMock);
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

      const id = getOrCreateSessionId();

      expect(id).toBe(mockUuid);
      expect(localStorage.getItem).toHaveBeenCalledWith(EXPECTED_KEY);
      expect(localStorage.setItem).toHaveBeenCalledWith(EXPECTED_KEY, mockUuid);
      expect(store[EXPECTED_KEY]).toBe(mockUuid);
    });

    it("pulls the existing identifier from the local store instead of creating a new one", () => {
      const existingId = "existing-uuid-9999";
      store[EXPECTED_KEY] = existingId;

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
      store[EXPECTED_KEY] = targetId;

      expect(isCurrentSession(targetId)).toBe(true);
    });

    it("returns false when provided an alternate or missing comparison string identifier", () => {
      store[EXPECTED_KEY] = "match-me-1234";

      expect(isCurrentSession("mismatched-id-5678")).toBe(false);
      expect(isCurrentSession(undefined)).toBe(false);
    });
  });

  describe("clearLocalSession", () => {
    it("purges targeted session keys cleanly from storage namespaces", () => {
      store[EXPECTED_KEY] = "temp-token";

      clearLocalSession();

      expect(localStorage.removeItem).toHaveBeenCalledWith(EXPECTED_KEY);
      expect(store[EXPECTED_KEY]).toBeUndefined();
      expect(localStorage.getItem(EXPECTED_KEY)).toBeNull();
    });
  });
});
