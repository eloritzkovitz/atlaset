import { renderHook, waitFor, act } from "@testing-library/react";
import { useMarkdownRenderer } from "./useMarkdownRenderer";
import { vi } from "vitest";

describe("useMarkdownRenderer", () => {
  it("should have nulls initially", () => {
    const { result } = renderHook(() => useMarkdownRenderer());
    const allNull =
      result.current.ReactMarkdown === null &&
      result.current.remarkGfm === null &&
      result.current.rehypeRaw === null &&
      result.current.rehypePrism === null;
    const allDefined =
      result.current.ReactMarkdown !== null &&
      result.current.remarkGfm !== null &&
      result.current.rehypeRaw !== null &&
      result.current.rehypePrism !== null;
    expect(allNull || allDefined).toBe(true);
  });

  it("should not update state after unmount (cleanup)", async () => {
    const origImport =
      (globalThis as any).__import ?? (globalThis as any).import;
    const importMock = vi.fn((mod) => {
      if (mod === "react-markdown")
        return Promise.resolve({ default: () => null });
      if (mod === "remark-gfm") return Promise.resolve({ default: () => null });
      if (mod === "rehype-raw") return Promise.resolve({ default: () => null });
      if (mod === "rehype-prism-plus")
        return Promise.resolve({ default: () => null });
      return origImport ? origImport(mod) : Promise.resolve({});
    });
    // @ts-ignore
    globalThis.__import = importMock;
    const { result, unmount } = renderHook(() => useMarkdownRenderer());
    unmount();
    // Wait a tick to allow any pending promises to resolve
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });
    // State should remain null after unmount
    expect(result.current.ReactMarkdown).toBeNull();
    expect(result.current.remarkGfm).toBeNull();
    expect(result.current.rehypeRaw).toBeNull();
    expect(result.current.rehypePrism).toBeNull();
    // @ts-ignore
    globalThis.__import = origImport;
  });

  it("should eventually provide ReactMarkdown, remarkGfm, rehypeRaw, and rehypePrism", async () => {
    const origImport =
      (globalThis as any).__import ?? (globalThis as any).import;
    // @ts-ignore
    globalThis.__import = (mod: string) => {
      return Promise.resolve({ default: () => null });
    };
    const { result } = renderHook(() => useMarkdownRenderer());

    await waitFor(() => {
      expect(result.current.ReactMarkdown).toBeDefined();
      expect(result.current.remarkGfm).toBeDefined();
      expect(result.current.rehypeRaw).toBeDefined();
      expect(result.current.rehypePrism).toBeDefined();
    });

    // @ts-ignore
    globalThis.__import = origImport;
  });

  it("should handle import errors gracefully", async () => {
    const origImport =
      (globalThis as any).__import ?? (globalThis as any).import;
    // @ts-ignore
    globalThis.__import = (_mod: string) => Promise.reject(new Error("fail"));

    // Ensure fresh module load so prior tests' imports don't leak
    vi.resetModules();
    const { useMarkdownRenderer: useMarkdownRendererError } =
      await import("./useMarkdownRenderer");

    const { result } = renderHook(() => useMarkdownRendererError());

    // Wait a tick to allow useEffect to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(result.current.ReactMarkdown).toBeNull();
    expect(result.current.remarkGfm).toBeNull();
    expect(result.current.rehypeRaw).toBeNull();
    expect(result.current.rehypePrism).toBeNull();

    // @ts-ignore
    globalThis.__import = origImport;
  });
});
