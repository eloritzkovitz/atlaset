import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMarkdownFile } from "./useMarkdownFile";

const mockFetch = (
  implementation: Parameters<typeof vi.fn<typeof fetch>>[0],
) => {
  const fetchMock = vi.fn<typeof fetch>(implementation);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

const renderMarkdownHook = (path?: string) =>
  renderHook(({ path }: { path?: string }) => useMarkdownFile(path), {
    initialProps: { path },
  });

describe("useMarkdownFile", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty content when no path is provided", () => {
    const fetchMock = mockFetch(() => Promise.resolve(new Response("Test")));

    const { result } = renderMarkdownHook();

    expect(result.current.content).toBe("");
    expect(result.current.error).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("loads markdown content", async () => {
    const fetchMock = mockFetch(() => Promise.resolve(new Response("# Test")));

    const { result } = renderMarkdownHook("/docs/test.md");

    await waitFor(() => expect(result.current.content).toBe("# Test"));

    expect(result.current.error).toBeNull();
    expect(fetchMock).toHaveBeenCalledWith("/docs/test.md");
  });

  it("sets an error when the request fails", async () => {
    const fetchMock = mockFetch(() =>
      Promise.resolve(new Response(null, { status: 404 })),
    );

    const { result } = renderMarkdownHook("/docs/test.md");

    await waitFor(() =>
      expect(result.current.error).toBe("Failed to load file"),
    );

    expect(result.current.content).toBe("");
    expect(fetchMock).toHaveBeenCalledWith("/docs/test.md");
  });

  it("sets the request error when fetch throws", async () => {
    mockFetch(() => Promise.reject(new Error("Network error")));

    const { result } = renderMarkdownHook("/docs/test.md");

    await waitFor(() => expect(result.current.error).toBe("Network error"));

    expect(result.current.content).toBe("");
  });

  it("uses the fallback error for non-Error failures", async () => {
    mockFetch(() => Promise.reject("Unknown error"));

    const { result } = renderMarkdownHook("/docs/test.md");

    await waitFor(() =>
      expect(result.current.error).toBe("Failed to load file"),
    );

    expect(result.current.content).toBe("");
  });

  it("does not update state after unmount", async () => {
    let resolveFetch!: (response: Response) => void;

    const fetchPromise = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });

    mockFetch(() => fetchPromise);

    const { result, unmount } = renderMarkdownHook("/docs/test.md");

    unmount();
    resolveFetch(new Response("Should not set"));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(result.current.content).toBe("");
    expect(result.current.error).toBeNull();
  });

  it("resets and reloads when the path changes", async () => {
    const fetchMock = mockFetch(
      vi
        .fn<typeof fetch>()
        .mockResolvedValueOnce(new Response("A"))
        .mockResolvedValueOnce(new Response("B")),
    );

    const { result, rerender } = renderMarkdownHook("/docs/a.md");

    await waitFor(() => expect(result.current.content).toBe("A"));

    rerender({ path: "/docs/b.md" });

    await waitFor(() => expect(result.current.content).toBe("B"));

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(1, "/docs/a.md");
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/docs/b.md");
  });

  it("resets content and error when the path becomes undefined", async () => {
    const fetchMock = mockFetch(() => Promise.resolve(new Response("Test")));

    const { result, rerender } = renderMarkdownHook("/docs/test.md");

    await waitFor(() => expect(result.current.content).toBe("Test"));

    rerender({ path: undefined });

    expect(result.current.content).toBe("");
    expect(result.current.error).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
