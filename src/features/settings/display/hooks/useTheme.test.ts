import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useTheme } from "./useTheme";
import { useSettings } from "../../common/hooks/useSettings";

vi.mock("../../common/hooks/useSettings", () => ({
  useSettings: vi.fn(),
}));

describe("useTheme", () => {
  const mockUpdateSettings = vi.fn();
  let mediaQueryListeners: Array<(e: MediaQueryListEvent) => void> = [];

  const mockMatchMedia = (matches: boolean) => {
    mediaQueryListeners = [];
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)" ? matches : false,
        media: query,
        addEventListener: vi.fn((_, listener) =>
          mediaQueryListeners.push(listener),
        ),
        removeEventListener: vi.fn((_, listener) => {
          mediaQueryListeners = mediaQueryListeners.filter(
            (l) => l !== listener,
          );
        }),
        addListener: vi.fn((listener) => mediaQueryListeners.push(listener)),
        removeListener: vi.fn((listener) => {
          mediaQueryListeners = mediaQueryListeners.filter(
            (l) => l !== listener,
          );
        }),
      })),
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia(true);
    (useSettings as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      settings: { display: { theme: "dark", accent: "blue" } },
      updateSettings: mockUpdateSettings,
    });
  });

  afterEach(() => {
    document.documentElement.className = "";
    document.documentElement.removeAttribute("style");
  });

  it("should initialize with correct resolved theme and preference", () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.preference).toBe("dark");
    expect(result.current.theme).toBe("dark");
    expect(result.current.accent).toBe("blue");
  });

  it("should update settings when setTheme or setAccent is called", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme("light");
    });

    expect(mockUpdateSettings).toHaveBeenCalledWith({
      display: { theme: "light", accent: "blue" },
    });

    act(() => {
      result.current.setAccent("indigo");
    });

    expect(mockUpdateSettings).toHaveBeenCalledWith({
      display: { theme: "dark", accent: "indigo" },
    });
  });

  it("should resolve system theme dynamically when preference is 'system'", () => {
    mockMatchMedia(false);

    (useSettings as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      settings: { display: { theme: "system", accent: "blue" } },
      updateSettings: mockUpdateSettings,
    });

    const { result } = renderHook(() => useTheme());

    expect(result.current.preference).toBe("system");
    expect(result.current.theme).toBe("light");
  });

  it("should respond to live OS system theme change events", () => {
    mockMatchMedia(true);

    (useSettings as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      settings: { display: { theme: "system", accent: "blue" } },
      updateSettings: mockUpdateSettings,
    });

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
    act(() => {
      mediaQueryListeners.forEach((listener) =>
        listener({ matches: false } as MediaQueryListEvent),
      );
    });
    expect(result.current.theme).toBe("light");
  });
});
