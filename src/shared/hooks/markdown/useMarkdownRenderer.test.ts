import { renderHook, waitFor } from "@testing-library/react";
import { useMarkdownRenderer } from "./useMarkdownRenderer";
import { vi } from "vitest";

describe("useMarkdownRenderer", () => {
  it("should have nulls initially", () => {
    const { result } = renderHook(() => useMarkdownRenderer());
    expect(result.current.ReactMarkdown).toBeNull();
    expect(result.current.remarkGfm).toBeNull();
    expect(result.current.rehypeRaw).toBeNull();
    expect(result.current.rehypePrism).toBeNull();
  });

  it("should not update state after unmount (cleanup)", async () => {
    const { result, unmount } = renderHook(() => useMarkdownRenderer());
    unmount();
    // Wait a tick to allow any pending promises to resolve
    await new Promise((resolve) => setTimeout(resolve, 10));
    // State should remain null after unmount
    expect(result.current.ReactMarkdown).toBeNull();
    expect(result.current.remarkGfm).toBeNull();
    expect(result.current.rehypeRaw).toBeNull();
    expect(result.current.rehypePrism).toBeNull();
  });

  it("should eventually provide ReactMarkdown, remarkGfm, rehypeRaw, and rehypePrism", async () => {
    const { result } = renderHook(() => useMarkdownRenderer());

    await waitFor(() => {
      expect(result.current.ReactMarkdown).toBeDefined();
      expect(result.current.remarkGfm).toBeDefined();
      expect(result.current.rehypeRaw).toBeDefined();
      expect(result.current.rehypePrism).toBeDefined();
    });
  });

  it("should handle import errors gracefully", async () => {
    vi.resetModules();
    vi.mock("react-markdown", () => {
      throw new Error("fail");
    });
    vi.mock("remark-gfm", () => {
      throw new Error("fail");
    });
    vi.mock("rehype-raw", () => {
      throw new Error("fail");
    });
    vi.mock("rehype-prism-plus", () => {
      throw new Error("fail");
    });

    // Dynamically import the hook file to reset its state
    const { useMarkdownRenderer: useMarkdownRendererError } =
      await import("./useMarkdownRenderer");
    const { result } = renderHook(() => useMarkdownRendererError());

    // Wait a tick to allow useEffect to run
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(result.current.ReactMarkdown).toBeNull();
    expect(result.current.remarkGfm).toBeNull();
    expect(result.current.rehypeRaw).toBeNull();
    expect(result.current.rehypePrism).toBeNull();
    vi.unmock("react-markdown");
    vi.unmock("remark-gfm");
    vi.unmock("rehype-raw");
    vi.unmock("rehype-prism-plus");
  });
});
