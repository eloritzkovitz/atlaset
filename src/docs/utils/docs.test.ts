import { describe, it, expect, vi } from "vitest";
import { getSlugFromPath, getDocBySlug, navigateToDoc } from "./docs";

describe("docs utils", () => {
  it("getSlugFromPath extracts last segment", () => {
    expect(getSlugFromPath("/docs/developers/developer-guide")).toBe(
      "developer-guide",
    );
    expect(getSlugFromPath("/docs")).toBeUndefined();
    expect(getSlugFromPath("/")).toBeUndefined();
  });

  it("getSlugFromPath returns undefined for non-doc paths", () => {
    expect(getSlugFromPath("/something/else")).toBeUndefined();
  });

  it("getDocBySlug matches nested file paths and falls back", () => {
    const doc = getDocBySlug("developer-guide");
    expect(doc).toBeDefined();
    expect(doc!.file.endsWith("developer-guide.md")).toBe(true);

    const gs = getDocBySlug("get-started");
    expect(gs).toBeDefined();
    expect(gs!.file.endsWith("get-started.md")).toBe(true);

    const fallback = getDocBySlug("nonexistent-slug");
    expect(fallback).toBeUndefined();

    const undef = getDocBySlug(undefined);
    expect(undef).toBeUndefined();

    const fullPathDoc = getDocBySlug("getstarted/get-started");
    expect(fullPathDoc).toBeDefined();
    expect(fullPathDoc!.file.endsWith("get-started.md")).toBe(true);
  });

  it("navigateToDoc builds correct path", () => {
    const navigate = vi.fn();
    navigateToDoc(navigate, "developers/developer-guide.md");
    expect(navigate).toHaveBeenCalledWith("/docs/developers/developer-guide");

    const navigate2 = vi.fn();
    navigateToDoc(navigate2, "");
    expect(navigate2).not.toHaveBeenCalled();
  });
});
