import { vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useEventListener } from "./useEventListener";

// Helper to simulate events
function fireEvent(
  target: EventTarget,
  eventName: string,
  eventInit?: EventInit,
) {
  const event = new Event(eventName, eventInit);
  target.dispatchEvent(event);
}

describe("useEventListener", () => {
  it("should call handler on window event", () => {
    const handler = vi.fn();
    renderHook(() => useEventListener("resize", handler, window));
    fireEvent(window, "resize");
    expect(handler).toHaveBeenCalled();
  });

  it("should call handler on element event", () => {
    const handler = vi.fn();
    const div = document.createElement("div");
    renderHook(() => useEventListener("click", handler, div));
    fireEvent(div, "click");
    expect(handler).toHaveBeenCalled();
  });

  it("should update handler if changed", () => {
    let count = 0;
    const handler = () => {
      count += 1;
    };
    const { rerender } = renderHook(
      ({ h }) => useEventListener("resize", h, window),
      {
        initialProps: { h: handler },
      },
    );
    fireEvent(window, "resize");
    expect(count).toBe(1);
    const handler2 = () => {
      count += 10;
    };
    rerender({ h: handler2 });
    fireEvent(window, "resize");
    expect(count).toBe(11);
  });  
});
