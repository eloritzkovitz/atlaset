import { describe, it, expect } from "vitest";
import { parseUserAgent, getDeviceType } from "./device";

describe("Device Utilities (parseUserAgent & getDeviceType)", () => {
  const cases = [
    // Edge cases and fallbacks
    { ua: "", type: "desktop", name: "Unknown Device" },
    { ua: undefined, type: "desktop", name: "Unknown Device" },
    { ua: "   ", type: "desktop", name: "Unknown Device" },

    // Desktop
    {
      ua: "Mozilla/5.0 Windows NT 10.0; Edg/120.0",
      type: "desktop",
      name: "Edge on Windows",
    },
    {
      ua: "Mozilla/5.0 Windows NT 10.0; Win64; Chrome/120.0",
      type: "desktop",
      name: "Chrome on Windows",
    },
    {
      ua: "Mozilla/5.0 Macintosh; Intel Mac OS X; Firefox/120.0",
      type: "desktop",
      name: "Firefox on macOS",
    },
    {
      ua: "Mozilla/5.0 Macintosh; Intel Mac OS X; Safari/605.1",
      type: "desktop",
      name: "Safari on macOS",
    },
    {
      ua: "Mozilla/5.0 (X11; Linux x86_64; Firefox/120.0)",
      type: "desktop",
      name: "Firefox on Linux",
    },
    {
      ua: "Mozilla/5.0 Linux; Chromium/120.0",
      type: "desktop",
      name: "Browser on Linux",
    },
    {
      ua: "Mozilla/5.0 UnknownBrowser/1.0",
      type: "desktop",
      name: "Browser on Unknown OS",
    },

    // Mobile
    {
      ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X; Safari/605.1)",
      type: "mobile",
      name: "Safari on iOS",
    },
    {
      ua: "Mozilla/5.0 (Linux; Android 14; Mobile; Chrome/120.0)",
      type: "mobile",
      name: "Chrome on Android",
    },

    // Tablet
    {
      ua: "Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X; Safari/605.1)",
      type: "tablet",
      name: "Safari on iOS",
    },
    {
      ua: "Mozilla/5.0 (Linux; Android 14; Tablet; Chrome/120.0)",
      type: "tablet",
      name: "Chrome on Android",
    },
  ];

  it.each(cases)(
    "resolves to type '$type' and name '$name'",
    ({ ua, type, name }) => {
      expect(getDeviceType(ua)).toBe(type);
      expect(parseUserAgent(ua)).toBe(name);
    },
  );
});
