import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useMarkdownFile } from "./useMarkdownFile";

describe("useMarkdownFile", () => {
  beforeAll(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({ ok: true, text: () => Promise.resolve("") }),
      ),
    );
  });
  beforeEach(() => {
    vi.mocked(global.fetch).mockClear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads markdown content successfully", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve("# Test\nThis is a test markdown file."),
        }),
      ),
    );
    const { result } = renderHook(
      (props?: { path?: string }) => useMarkdownFile(props?.path),
      { initialProps: { path: "/test.md" } },
    );
    await waitFor(() => {
      expect(result.current.content).toBe(
        "# Test\nThis is a test markdown file.",
      );
    });
    expect(result.current.error).toBeNull();
  });

  it("sets error on fetch failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: false })),
    );
    const { result } = renderHook(
      (props?: { path?: string }) => useMarkdownFile(props?.path),
      { initialProps: { path: "/test.md" } },
    );
    await waitFor(() => {
      expect(result.current.error).toMatch(/Failed to load file/);
    });
    expect(result.current.content).toBe("");
  });

  it("sets error if fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Network error"))),
    );
    const { result } = renderHook(
      (props?: { path?: string }) => useMarkdownFile(props?.path),
      { initialProps: { path: "/test.md" } },
    );
    await waitFor(() => {
      expect(result.current.error).toMatch(/Network error/);
    });
    expect(result.current.content).toBe("");
  });

  it("does not update state after unmount (cleanup)", async () => {
    let resolveFetch: (value: any) => void;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(() => fetchPromise),
    );
    const { result, unmount } = renderHook(
      (props?: { path?: string }) => useMarkdownFile(props?.path),
      { initialProps: { path: "/test.md" } },
    );
    unmount();
    // Simulate fetch resolving after unmount
    resolveFetch!({ ok: true, text: () => Promise.resolve("Should not set") });
    // Wait a tick to allow any pending promises to resolve
    await new Promise((resolve) => setTimeout(resolve, 10));
    // State should remain initial
    expect(result.current.content).toBe("");
    expect(result.current.error).toBeNull();
  });

  it("resets and reloads when path changes", async () => {
    let fetchCount = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        fetchCount++;
        if (url === "/a.md") {
          return Promise.resolve({
            ok: true,
            text: () => Promise.resolve("A"),
          });
        }
        if (url === "/b.md") {
          return Promise.resolve({
            ok: true,
            text: () => Promise.resolve("B"),
          });
        }
        return Promise.resolve({ ok: false });
      }),
    );
    const { result, rerender } = renderHook(
      (props?: { path?: string }) => useMarkdownFile(props?.path),
      {
        initialProps: { path: "/a.md" },
      },
    );
    await waitFor(() => {
      expect(result.current.content).toBe("A");
    });
    rerender({ path: "/b.md" });
    await waitFor(() => {
      expect(result.current.content).toBe("B");
    });
    expect(fetchCount).toBe(2);
  });

  it("resets content and error when path is undefined", async () => {
    const { result, rerender } = renderHook(
      (props?: { path?: string }) => useMarkdownFile(props?.path),
      { initialProps: { path: "/test.md" } },
    );
    await waitFor(() => {
      expect(vi.mocked(global.fetch)).toHaveBeenCalledWith("/test.md");
    });
    rerender();
    expect(result.current.content).toBe("");
    expect(result.current.error).toBeNull();
    expect(vi.mocked(global.fetch)).toHaveBeenCalledTimes(1);
  });
});
