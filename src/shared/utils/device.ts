/**
 * Utility functions for parsing and interpreting user agent strings to identify device and browser information.
 */

import type { DeviceType, HardwareSpecs } from "@types";

/**
 * Extracts the browser name from a standard User Agent string.
 * @param ua - The user agent string to parse.
 * @returns The name of the browser.
 */
function getBrowserName(ua: string): string {
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome") && !ua.includes("Chromium")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  return "Browser";
}

/**
 * Extracts the operating system name from a standard User Agent string.
 * @param ua - The user agent string to parse.
 * @returns The name of the operating system.
 */
function getOSName(ua: string): string {
  if (ua.includes("Windows NT 10.0")) return "Windows";
  if (ua.includes("Macintosh")) return "macOS";
  if (ua.includes("Linux") && !ua.includes("Android")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";

  return "Unknown OS";
}

/**
 * Parses a raw user agent string into a clear, human-readable UI name.
 * @param uaString - The user agent string to parse.
 * @returns A human-readable device name.
 */
export function parseUserAgent(uaString?: string): string {
  const ua = uaString?.trim() || "";
  if (!ua) return "Unknown Device";

  const browser = getBrowserName(ua);
  const os = getOSName(ua);

  return `${browser} on ${os}`;
}

/**
 * Returns the matching key for the ICONS registry based on the user agent string.
 * @param uaString - The user agent string to parse.
 * @returns A string key corresponding to the device type.
 */
export function getDeviceType(uaString?: string): DeviceType {
  const ua = uaString || "";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android/i.test(ua)) return "mobile";
  return "desktop";
}

/**
 * Categorizes a device based on screen dimensions and hardware indicators.
 * @param specs - An object containing the device's width, height, battery status, and touch capability.
 * @returns A string representing the device type.
 */
export function determineDeviceFromHardware({
  width,
  hasBattery,
  hasTouch,
}: HardwareSpecs): DeviceType {
  if (width < 768) return "mobile";
  if (width >= 768 && width < 1024) return "tablet";

  // If the device has a battery or touch capability, it's likely a laptop; otherwise, it's a desktop
  if (hasBattery || hasTouch || width < 1440) {
    return "laptop";
  }

  return "desktop";
}
