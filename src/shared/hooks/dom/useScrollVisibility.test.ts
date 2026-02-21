import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollVisibility } from "./useScrollVisibility";

function createDivRef(scrollHeight = 1000, clientHeight = 500) {
  const div = document.createElement("div");
  Object.defineProperty(div, "scrollHeight", {
    value: scrollHeight,
    configurable: true,
  });
  Object.defineProperty(div, "clientHeight", {
    value: clientHeight,
    configurable: true,
  });
  document.body.appendChild(div);
  return { div, ref: { current: div } };
}

describe("useScrollVisibility", () => {
  it("should detect scrollability on mount", () => {
    const { ref } = createDivRef(1000, 500);
    const { result } = renderHook(() => useScrollVisibility(ref));
    expect(result.current[1]).toBe(true);
  });

  it("should update scrollState on scroll", () => {
    const { div, ref } = createDivRef();
    const onScroll = vi.fn((scrollTop) => scrollTop);
    const { result } = renderHook(() => useScrollVisibility(ref, onScroll));
    act(() => {
      div.scrollTop = 123;
      div.dispatchEvent(new Event("scroll"));
    });
    expect(onScroll).toHaveBeenCalledWith(123);
    expect(result.current[0]).toBe(123);
  });

  it("should update scrollability on mutation", async () => {
    const { div, ref } = createDivRef(500, 500);
    const { result } = renderHook(() => useScrollVisibility(ref));
    expect(result.current[1]).toBe(false);
    await act(async () => {
      Object.defineProperty(div, "scrollHeight", { value: 1000 });
      div.textContent = "changed";
      // Wait for mutation observer callback
      await new Promise((resolve) => setTimeout(resolve, 20));
    });
    expect(result.current[1]).toBe(true);
  });

  it("should update scrollability on resize", () => {
    const { div, ref } = createDivRef(1000, 1000);
    const { result } = renderHook(() => useScrollVisibility(ref));
    expect(result.current[1]).toBe(false);
    act(() => {
      Object.defineProperty(div, "clientHeight", { value: 500 });
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current[1]).toBe(true);
  });

  it("should handle ref.current null", () => {
    const { result } = renderHook(() => useScrollVisibility({ current: null }));
    expect(result.current[1]).toBe(false);
  });

  it("should do nothing if ref is null (early return)", () => {
    const onScroll = vi.fn();
    const { result, unmount } = renderHook(() =>
      useScrollVisibility({ current: null }, onScroll),
    );
    expect(result.current[1]).toBe(false);
    unmount();
  });

  it("should clean up mutation observer on unmount", () => {
    const { ref } = createDivRef();
    const disconnectSpy = vi.spyOn(MutationObserver.prototype, "disconnect");
    const { unmount } = renderHook(() => useScrollVisibility(ref));
    unmount();
    expect(disconnectSpy).toHaveBeenCalled();
    disconnectSpy.mockRestore();
  });
});
