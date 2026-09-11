import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useArrowNavigation } from "./useArrowNavigation";

describe("useArrowNavigation", () => {
  const renderNavigation = (
    options: Partial<Parameters<typeof useArrowNavigation>[0]> = {},
  ) => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();

    renderHook(() =>
      useArrowNavigation({
        canPrevious: true,
        canNext: true,
        onPrevious,
        onNext,
        ...options,
      }),
    );

    return { onPrevious, onNext };
  };

  const pressKey = (key: string) => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key }));
  };

  it("navigates with left/right arrows in LTR", () => {
    const { onPrevious, onNext } = renderNavigation();

    pressKey("ArrowLeft");
    pressKey("ArrowRight");

    expect(onPrevious).toHaveBeenCalledOnce();
    expect(onNext).toHaveBeenCalledOnce();
  });

  it("reverses navigation in RTL", () => {
    const { onPrevious, onNext } = renderNavigation({
      isRTL: true,
    });

    pressKey("ArrowRight");
    pressKey("ArrowLeft");

    expect(onPrevious).toHaveBeenCalledOnce();
    expect(onNext).toHaveBeenCalledOnce();
  });

  it("does not navigate when at a boundary", () => {
    const { onPrevious, onNext } = renderNavigation({
      canPrevious: false,
      canNext: false,
    });

    pressKey("ArrowLeft");
    pressKey("ArrowRight");

    expect(onPrevious).not.toHaveBeenCalled();
    expect(onNext).not.toHaveBeenCalled();
  });

  it("allows navigation past boundaries when wrapping is enabled", () => {
    const { onPrevious, onNext } = renderNavigation({
      canPrevious: false,
      canNext: false,
      wrap: true,
    });

    pressKey("ArrowLeft");
    pressKey("ArrowRight");

    expect(onPrevious).toHaveBeenCalledOnce();
    expect(onNext).toHaveBeenCalledOnce();
  });

  it("does not respond when disabled", () => {
    const { onPrevious, onNext } = renderNavigation({
      enabled: false,
    });

    pressKey("ArrowLeft");
    pressKey("ArrowRight");

    expect(onPrevious).not.toHaveBeenCalled();
    expect(onNext).not.toHaveBeenCalled();
  });
});
