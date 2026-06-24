import { describe, it, expect, beforeEach, vi } from "vitest";
import { isExternalUrl, getQueryParam } from "./url";

describe("isExternalUrl", () => {
  it("should return false if url is undefined or empty", () => {
    expect(isExternalUrl()).toBe(false);
    expect(isExternalUrl("")).toBe(false);
  });

  it("should return true for absolute web URLs", () => {
    expect(isExternalUrl("https://google.com")).toBe(true);
    expect(isExternalUrl("http://localhost:3000")).toBe(true);
    expect(isExternalUrl("//cdn.example.com/asset.js")).toBe(true);
  });

  it("should return true for protocol-specific communication anchors", () => {
    expect(isExternalUrl("mailto:support@example.com")).toBe(true);
    expect(isExternalUrl("tel:+1234567890")).toBe(true);
  });

  it("should return false for local client-side routes and relative anchors", () => {
    expect(isExternalUrl("/dashboard/settings")).toBe(false);
    expect(isExternalUrl("profile/edit")).toBe(false);
    expect(isExternalUrl("#main-content")).toBe(false);
    expect(isExternalUrl("?query=test")).toBe(false);
  });
});

describe("getQueryParam", () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    vi.restoreAllMocks();
    globalThis.window = originalWindow;
  });

  it("should extract matching parameters successfully from the window context location", () => {
    vi.stubGlobal("window", {
      location: {
        search: "?query=react&tab=active",
      },
    });

    expect(getQueryParam("query")).toBe("react");
    expect(getQueryParam("tab")).toBe("active");
  });

  it("should return the default fallback string if parameter key does not exist", () => {
    vi.stubGlobal("window", {
      location: {
        search: "?query=react",
      },
    });

    expect(getQueryParam("nonexistent")).toBe("");
    expect(getQueryParam("nonexistent", "default_value")).toBe("default_value");
  });

  it("should gracefully return fallback if window or location is undefined (SSR environment fallback check)", () => {
    vi.stubGlobal("window", undefined);
    expect(getQueryParam("query", "ssr_fallback")).toBe("ssr_fallback");
  });

  it("should log an error and return fallback if parsing search string throws an exception", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.stubGlobal("window", {
      get location() {
        throw new Error(
          "Simulated browser security sandbox restriction exception",
        );
      },
    });

    const result = getQueryParam("query", "error_fallback");

    expect(result).toBe("error_fallback");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy.mock.calls[0][0]).toContain(
      "Failed to parse URL query parameter for key: query",
    );
  });
});
