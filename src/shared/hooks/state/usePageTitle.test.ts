import { renderHook } from "@testing-library/react";
import { usePageTitle } from "./usePageTitle";

describe("usePageTitle", () => {
  const originalTitle = document.title;

  afterEach(() => {
    document.title = originalTitle;
  });

  it("sets the document title with default suffix", () => {
    renderHook(() => usePageTitle("Test Page"));
    expect(document.title).toBe("Test Page");
  });

  it("sets the document title with custom suffix and fallback", () => {
    renderHook(() =>
      usePageTitle("Custom", { suffix: " - App", fallback: "Fallback" }),
    );
    expect(document.title).toBe("Custom - App");
  });

  it("sets the fallback title if no title is provided", () => {
    renderHook(() =>
      usePageTitle(undefined, { suffix: " | App", fallback: "Fallback" }),
    );
    expect(document.title).toBe("Fallback | App");
  });

  it("restores the fallback title on unmount", () => {
    const { unmount } = renderHook(() =>
      usePageTitle("Unmount Test", { fallback: "Restored" }),
    );
    expect(document.title).toBe("Unmount Test");
    unmount();
    expect(document.title).toBe("Restored");
  });

  it("updates the title when the input changes", () => {
    const { rerender } = renderHook(({ title }) => usePageTitle(title), {
      initialProps: { title: "First" },
    });
    expect(document.title).toBe("First");
    rerender({ title: "Second" });
    expect(document.title).toBe("Second");
  });
});
