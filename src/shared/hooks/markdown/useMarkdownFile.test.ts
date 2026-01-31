import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useMarkdownFile } from "./useMarkdownFile";

describe("useMarkdownFile", () => {
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
    const { result } = renderHook(() => useMarkdownFile("/test.md"));
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
    const { result } = renderHook(() => useMarkdownFile("/test.md"));
    await waitFor(() => {
      expect(result.current.error).toMatch(/Failed to load file/);
    });
    expect(result.current.content).toBe("");
  });
});
