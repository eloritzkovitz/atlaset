import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { createMockUser } from "@test-utils/authMocks";
import i18n from "i18next";

vi.mock("@constants/languages", () => ({
  getLanguageByCode: (code: string) => ({
    isRtl: ["ar", "he", "fa"].includes(code),
  }),
  LANGUAGES: [{ code: "he" }, { code: "en" }],
}));

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

vi.mock("i18next", () => ({
  default: {
    language: "en",
    changeLanguage: vi.fn(async () => {}),
  },
}));

vi.mock("@hooks", () => ({ useDebounce: (v: any) => v }));

let freshUser: any;
const useAuthMock = vi.fn();

vi.mock("@contexts/AuthContext", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("../../common/slices/settingsSlice", () => ({
  saveSettings: vi.fn((payload: any) => ({ type: "SAVE_SETTINGS", payload })),
  selectSettings: () => ({ localization: { language: "en" } }),
}));

vi.mock("../selectors", () => ({ selectSettingsReady: () => false }));

import { useSelector } from "react-redux";
import {
  saveSettings,
  selectSettings,
} from "../../common/slices/settingsSlice";
import { selectSettingsReady } from "../../selectors";
import { isRtl } from "./useLanguage";
import { setupDefaultReduxMocks } from "@test-utils/reduxMocks";

const mockReduxSettings = (language = "he", ready = true) => {
  vi.mocked(useSelector).mockImplementation((selector) => {
    if (selector === selectSettings) return { localization: { language } };
    if (selector === selectSettingsReady) return ready;
    return undefined;
  });
};

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
  let dispatchMock: any;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    freshUser = createMockUser();
    useAuthMock.mockReturnValue({
      user: freshUser,
      loading: false,
      ready: true,
    });

    const reduxMocks = setupDefaultReduxMocks();
    dispatchMock = reduxMocks.dispatchMock;

    vi.mocked(i18n.changeLanguage).mockResolvedValue(undefined as any);
  });

  it("applies stored language when settings are ready and dispatches on change", async () => {
    mockReduxSettings("he", true);

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

    expect(vi.mocked(i18n.changeLanguage)).toHaveBeenCalledWith("he");
    expect(result.current.current).toBe("he");
    expect(dispatchMock).toHaveBeenCalled();
    expect(saveSettings).toHaveBeenCalledWith({
      localization: { language: "he" },
    });
  });

  it("resets appliedInitial when user logs out and reapplies on new user", async () => {
    mockReduxSettings("he", true);

    const { useLanguage } = await import("./useLanguage");
    const { result, rerender } = renderHook(() => useLanguage());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.current).toBe("en");

    useAuthMock.mockReturnValue({ user: null, loading: false, ready: true });
    rerender();

    useAuthMock.mockReturnValue({
      user: createMockUser(),
      loading: false,
      ready: true,
    });
    mockReduxSettings("he", true);
    rerender();

    expect(result.current.current).toBe("en");
  });

  it("toggle switches between he and en", async () => {
    mockReduxSettings("he", true);

    const { useLanguage } = await import("./useLanguage");
    const { result } = renderHook(() => useLanguage());

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      result.current.toggle();
    });

    expect(vi.mocked(i18n.changeLanguage)).toHaveBeenCalledWith("he");
    expect(result.current.current).toBe("he");
    expect(saveSettings).toHaveBeenCalled();
  });

  it("bails out early without updates if requested language matches active context", async () => {
    const { useLanguage } = await import("./useLanguage");
    const { result } = renderHook(() => useLanguage());

    await act(async () => {
      result.current.change("en");
    });

    expect(vi.mocked(i18n.changeLanguage).mock.calls.length).toBe(0);
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it("swallows rejections gracefully if underlying localization fails", async () => {
    vi.mocked(i18n.changeLanguage).mockRejectedValueOnce(
      new Error("Network failure"),
    );

    const { useLanguage } = await import("./useLanguage");
    const { result } = renderHook(() => useLanguage());

    await act(async () => {
      result.current.change("he");
    });

    expect(result.current.current).toBe("he");
  });

  it("modifies runtime interface state locally but drops persistence requests if unauthenticated", async () => {
    useAuthMock.mockReturnValue({ user: null, loading: false, ready: true });

    const { useLanguage } = await import("./useLanguage");
    const { result } = renderHook(() => useLanguage());

    await act(async () => {
      await result.current.change("he");
    });

    expect(result.current.current).toBe("he");
    expect(vi.mocked(i18n.changeLanguage)).toHaveBeenCalledWith("he");
    expect(dispatchMock).not.toHaveBeenCalled();
    expect(saveSettings).not.toHaveBeenCalled();
  });
});
