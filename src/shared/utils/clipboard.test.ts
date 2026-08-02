import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { copyToClipboard } from "./clipboard";

describe("copyToClipboard", () => {
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
  });

  it("returns true when text is successfully copied", async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });

    const result = await copyToClipboard("Hello, World!");

    expect(mockWriteText).toHaveBeenCalledTimes(1);
    expect(mockWriteText).toHaveBeenCalledWith("Hello, World!");
    expect(result).toBe(true);
  });

  it("returns false and logs error when writeText rejects", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const mockError = new Error("Permission denied");
    const mockWriteText = vi.fn().mockRejectedValue(mockError);

    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });

    const result = await copyToClipboard("Hello, World!");

    expect(mockWriteText).toHaveBeenCalledWith("Hello, World!");
    expect(consoleSpy).toHaveBeenCalledWith("Failed to copy:", mockError);
    expect(result).toBe(false);
  });

  it("returns false when navigator.clipboard is undefined", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const result = await copyToClipboard("Hello, World!");

    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
