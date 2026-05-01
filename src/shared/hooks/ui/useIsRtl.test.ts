import i18n from "i18next";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { isRtl, useIsRtl } from "./useIsRtl";

vi.mock("i18next", () => {
  const _mock: any = { language: "en", _handler: null };
  _mock.on = vi.fn((evt: string, h: any) => {
    if (evt === "languageChanged") _mock._handler = h;
  });
  _mock.off = vi.fn();
  return { default: _mock };
});

describe("isRtl", () => {
  it("returns true for known RTL languages and false otherwise", () => {
    expect(isRtl("ar")).toBe(true);
    expect(isRtl("ar-EG")).toBe(true);
    expect(isRtl("he")).toBe(true);
    expect(isRtl("fa")).toBe(true);
    expect(isRtl("en")).toBe(false);
  });

  it("falls back to i18n.language when no arg provided", () => {
    (i18n as any).language = "en";
    expect(isRtl()).toBe(false);
    (i18n as any).language = "ar-EG";
    expect(isRtl()).toBe(true);
  });

  it("handles null and empty language gracefully", () => {
    (i18n as any).language = "en";
    expect(isRtl(null)).toBe(false);
    (i18n as any).language = "";
    expect(isRtl()).toBe(false);
  });
});

describe("useIsRtl", () => {
  beforeEach(() => {
    (i18n as any).language = "en";
    (i18n as any)._handler = null;
    (i18n as any).on.mockClear();
    (i18n as any).off.mockClear();
  });

  it("returns initial RTL state and updates on languageChanged, and cleans up listener", () => {
    const { result, unmount } = renderHook(() => useIsRtl());
    expect(result.current).toBe(false);
    const handler = (i18n as any)._handler;
    expect(typeof handler).toBe("function");
    act(() => handler("ar"));
    expect(result.current).toBe(true);
    unmount();
    expect(i18n.off).toHaveBeenCalled();
  });
});
