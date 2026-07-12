import { renderHook } from "@testing-library/react";
import { usePageTitle } from "./usePageTitle";

const mockTCommon = vi.fn((_key: string, fallback: string) => fallback);
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: mockTCommon,
  }),
}));

describe("usePageTitle", () => {
  const originalTitle = document.title;

  beforeEach(() => {
    mockTCommon.mockImplementation(
      (_key: string, fallback: string) => fallback,
    );
  });

  afterEach(() => {
    document.title = originalTitle;
    vi.clearAllMocks();
  });

  it("sets the document title with the default centralized suffix template", () => {
    renderHook(() => usePageTitle("Test Page"));
    expect(document.title).toBe("Test Page | Atlaset");
  });

  it("sets the document title using a custom separator configuration override", () => {
    renderHook(() => usePageTitle("Custom", { separator: " - " }));
    expect(document.title).toBe("Custom - Atlaset");
  });

  it("sets the localized appName fallback title if no title is provided", () => {
    renderHook(() => usePageTitle(undefined));
    expect(document.title).toBe("Atlaset");
  });

  it("sets a custom developer-passed fallback override if no title is provided", () => {
    renderHook(() => usePageTitle(undefined, { fallback: "Custom Fallback" }));
    expect(document.title).toBe("Custom Fallback");
  });

  it("restores the fallback title setting context upon component unmount", () => {
    const { unmount } = renderHook(() => usePageTitle("Unmount Test"));
    expect(document.title).toBe("Unmount Test | Atlaset");

    unmount();
    expect(document.title).toBe("Atlaset");
  });

  it("updates the document layout string correctly when the title state updates dynamically", () => {
    const { rerender } = renderHook(({ title }) => usePageTitle(title), {
      initialProps: { title: "First" },
    });
    expect(document.title).toBe("First | Atlaset");

    rerender({ title: "Second" });
    expect(document.title).toBe("Second | Atlaset");
  });

  it("omits the standard app suffix when disableSuffix is true", () => {
    renderHook(() =>
      usePageTitle("Raw Isolated Title", { disableSuffix: true }),
    );
    expect(document.title).toBe("Raw Isolated Title");
  });
});
