import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMarkdown } from "./useMarkdown";

vi.mock("react-markdown", () => ({
  default: () => "MockedReactMarkdown",
}));
vi.mock("remark-gfm", () => ({
  default: () => "MockedRemarkGfm",
}));
vi.mock("./rehypeTypeScript", () => ({
  rehypeTypeScript: () => "MockedRehypeTypeScript",
}));

describe("useMarkdown", () => {
  it("should return null initially", () => {
    const { result } = renderHook(() => useMarkdown());
    expect(result.current).toBe(null);
  });

  it("should load plugins successfully", async () => {
    const { result } = renderHook(() => useMarkdown());

    await waitFor(() => {
      expect(result.current).not.toBe(null);
    });

    expect(result.current).toHaveProperty("ReactMarkdown");
    expect(result.current).toHaveProperty("remarkGfm");
    expect(result.current).toHaveProperty("rehypeTypeScript");
  });
});
