import { renderHook } from "@testing-library/react";
import { useBodyScrollLock } from "./useBodyScrollLock";

describe("useBodyScrollLock", () => {
  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("locks scroll when enabled is true", () => {
    renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores scroll when enabled is false", () => {
    document.body.style.overflow = "hidden";
    renderHook(() => useBodyScrollLock(false));
    expect(document.body.style.overflow).toBe("");
  });

  it("restores scroll on unmount", () => {
    const { unmount } = renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("toggles scroll lock when enabled changes", () => {
    const { rerender } = renderHook(
      ({ enabled }) => useBodyScrollLock(enabled),
      {
        initialProps: { enabled: true },
      },
    );
    expect(document.body.style.overflow).toBe("hidden");
    rerender({ enabled: false });
    expect(document.body.style.overflow).toBe("");
    rerender({ enabled: true });
    expect(document.body.style.overflow).toBe("hidden");
  });
});
