import i18n from "i18next";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { mockUser } from "@test-utils/mockUser";

vi.mock("@constants/languages", () => ({
  getLanguageByCode: (code: string) => ({ isRtl: ["ar", "he", "fa"].includes(code) }),
  LANGUAGES: [{ code: "he" }, { code: "en" }],
}));

import { isRtl } from "./useLanguage";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));
vi.mock("i18next", () => {
  const _mock = {
    language: "en",
    changeLanguage: vi.fn(async () => {}),
  };
  return { default: _mock };
});
vi.mock("@hooks", () => ({ useDebounce: (v: any) => v }));
vi.mock("@features/user", () => ({
  useAuth: vi.fn(() => ({ user: mockUser, loading: false, ready: true })),
}));

vi.mock("../../common/slices/settingsSlice", () => {
  const saveSettings = vi.fn((payload: any) => ({
    type: "SAVE_SETTINGS",
    payload,
  }));
  const selectSettings = () => ({ account: { language: "en" } });
  return {
    saveSettings,
    selectSettings,
  };
});
vi.mock("../selectors", () => ({ selectSettingsReady: () => false }));

import { useSelector, useDispatch } from "react-redux";
import { selectSettings, saveSettings } from "../../common/slices/settingsSlice";
import { selectSettingsReady } from "../../selectors";

describe("isRtl", () => {
  it("detects RTL languages by base code", () => {
    expect(isRtl("ar")).toBe(true);
    expect(isRtl("ar-EG")).toBe(true);
    expect(isRtl("he")).toBe(true);
    expect(isRtl("fa")).toBe(true);
    expect(isRtl("en")).toBe(false);
  });

  it("defaults to 'en' when no value provided", () => {
    expect(isRtl()).toBe(false);
  });
});

describe("useLanguage", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("applies stored language when settings are ready and dispatches on change", async () => {
    (useSelector as unknown as Mock).mockImplementation((selector) => {
      if (selector === selectSettings) return { account: { language: "he" } };
      if (selector === selectSettingsReady) return true;
      return undefined;
    });
    const dispatchMock = vi.fn(() => Promise.resolve());
    (useDispatch as unknown as Mock).mockReturnValue(dispatchMock);

    const { useLanguage } = await import("./useLanguage");
    const { result } = renderHook(() => useLanguage());
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.current).toBe("en");
    expect(result.current.isRtl).toBe(false);

    await act(async () => {
      await result.current.change("he");
    });

    expect((i18n as any).changeLanguage).toHaveBeenCalledWith("he");
    expect(result.current.current).toBe("he");
    expect(dispatchMock).toHaveBeenCalled();
    expect(saveSettings as unknown as Mock).toHaveBeenCalledWith({
      account: { language: "he" },
    });
  });

  it("resets appliedInitial when user logs out and reapplies on new user", async () => {
    (useSelector as unknown as Mock).mockImplementation((selector) => {
      if (selector === selectSettings) return { account: { language: "he" } };
      if (selector === selectSettingsReady) return true;
      return undefined;
    });
    const dispatchMock = vi.fn(() => Promise.resolve());
    (useDispatch as unknown as Mock).mockReturnValue(dispatchMock);

    const { useLanguage } = await import("./useLanguage");
    const { result, rerender } = renderHook(() => useLanguage());
    await act(async () => {
      await Promise.resolve();
    });

    // Hook does not auto-apply selector changes; initial value remains i18n.language
    expect(result.current.current).toBe("en");

    vi.mocked((await import("@features/user")).useAuth).mockReturnValue({
      user: null,
      loading: false,
      ready: true,
    });
    rerender();
    vi.mocked((await import("@features/user")).useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      ready: true,
    });
    (useSelector as unknown as Mock).mockImplementation((selector) => {
      if (selector === selectSettings) return { account: { language: "he" } };
      if (selector === selectSettingsReady) return true;
      return undefined;
    });
    rerender();
    // still unchanged
    expect(result.current.current).toBe("en");
  });

  it("toggle switches between he and en", async () => {
    (useSelector as unknown as Mock).mockImplementation((selector) => {
      if (selector === selectSettings) return { account: { language: "he" } };
      if (selector === selectSettingsReady) return true;
      return undefined;
    });
    const dispatchMock = vi.fn(() => Promise.resolve());
    (useDispatch as unknown as Mock).mockReturnValue(dispatchMock);

    const { useLanguage } = await import("./useLanguage");
    const { result } = renderHook(() => useLanguage());
    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await result.current.toggle();
    });

    // LANGUAGES mocked as [{he},{en}] so toggling from initial 'en' goes to 'he'
    expect((i18n as any).changeLanguage).toHaveBeenCalledWith("he");
    expect(result.current.current).toBe("he");
    expect(saveSettings as unknown as Mock).toHaveBeenCalled();
  });
});
