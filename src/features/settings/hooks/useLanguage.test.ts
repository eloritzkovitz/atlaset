import i18n from "i18next";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { isRtl, useLanguage } from "./useLanguage";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));
vi.mock("i18next", () => {
  const _mock: any = { language: "en", changeLanguage: vi.fn() };
  return { default: _mock };
});
vi.mock("@hooks", () => ({ useDebounce: (v: any) => v }));
vi.mock("@features/user", () => ({ useAuth: () => ({ user: { uid: "u1" } }) }));

vi.mock("../slices/settingsSlice", () => {
  const saveSettings = vi.fn((payload: any) => ({ type: "SAVE_SETTINGS", payload }));
  const selectSettings = () => ({ account: { language: "en" } });
  return {
    saveSettings,
    selectSettings,
  };
});
vi.mock("../selectors", () => ({ selectSettingsReady: () => false }));

import { useSelector, useDispatch } from "react-redux";
import { selectSettings, saveSettings } from "../slices/settingsSlice";
import { selectSettingsReady } from "../selectors";

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
    vi.clearAllMocks();
  });

  it("applies stored language when settings are ready and dispatches on change", async () => {
    (useSelector as unknown as Mock).mockImplementation((selector) => {
      if (selector === selectSettings) return { account: { language: "he" } };
      if (selector === selectSettingsReady) return true;
      return undefined;
    });
    const dispatchMock = vi.fn();
    (useDispatch as unknown as Mock).mockReturnValue(dispatchMock);

    const { result } = renderHook(() => useLanguage());

    expect(result.current.current).toBe("he");
    expect(result.current.isRtl).toBe(true);
    expect((i18n as any).changeLanguage).toHaveBeenCalledWith("he");

    await act(async () => {
      await result.current.change("en-US");
    });

    expect((i18n as any).changeLanguage).toHaveBeenCalledWith("en-US");
    expect(result.current.current).toBe("en");
    expect(dispatchMock).toHaveBeenCalled();
    expect(saveSettings as unknown as Mock).toHaveBeenCalledWith({
      account: { language: "en" },
    });
  });

  it("toggle switches between he and en", async () => {
    (useSelector as unknown as Mock).mockImplementation((selector) => {
      if (selector === selectSettings) return { account: { language: "he" } };
      if (selector === selectSettingsReady) return true;
      return undefined;
    });
    const dispatchMock = vi.fn();
    (useDispatch as unknown as Mock).mockReturnValue(dispatchMock);

    const { result } = renderHook(() => useLanguage());

    await act(async () => {
      await result.current.toggle();
    });

    expect((i18n as any).changeLanguage).toHaveBeenCalledWith("en");
    expect(result.current.current).toBe("en");
    expect(saveSettings as unknown as Mock).toHaveBeenCalled();
  });
});
