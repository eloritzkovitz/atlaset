import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mockAnimationsEnabled } from "@test-utils/settingsMocks";
import { useValueFlash } from "./useValueFlash";

describe("useValueFlash", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockAnimationsEnabled(true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should flash successClass when value increases and clear it after 500ms", () => {
    const { result, rerender } = renderHook(({ val }) => useValueFlash(val), {
      initialProps: { val: 10 },
    });

    expect(result.current).toBe("");

    rerender({ val: 11 });
    expect(result.current).toBe("text-success");

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("");
  });

  it("should flash dangerClass when value decreases and clear it after 500ms", () => {
    const { result, rerender } = renderHook(({ val }) => useValueFlash(val), {
      initialProps: { val: 10 },
    });

    rerender({ val: 9 });
    expect(result.current).toBe("text-danger");

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("");
  });

  it("should NOT flash any class if animations are disabled via accessibility settings", () => {
    mockAnimationsEnabled(false);

    const { result, rerender } = renderHook(({ val }) => useValueFlash(val), {
      initialProps: { val: 10 },
    });

    rerender({ val: 15 });
    expect(result.current).toBe("");
  });
});
