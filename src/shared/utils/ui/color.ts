/**
 * Utility functions for color manipulation.
 */

/**
 * Parses a color string (hex, rgb, rgba) into an array of RGBA components.
 * @param color - The color string to parse.
 * @returns An array containing [red, green, blue, alpha] values.
 */
export function parseRgba(color: string): [number, number, number, number] {
  if (!color || typeof color !== "string" || color === "transparent" || color === "none") {
    return [0, 0, 0, 0];
  }

  const trimmed = color.trim().toLowerCase();

  // Hex parsing
  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);
    let r = 0, g = 0, b = 0, a = 1;

    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else if (hex.length === 8) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
      a = parseInt(hex.slice(6, 8), 16) / 255;
    } else {
      return [0, 0, 0, 0];
    }

    if ([r, g, b, a].some((v) => Number.isNaN(v))) {
      return [0, 0, 0, 0];
    }

    return [r, g, b, a];
  }

  // RGB / RGBA parsing
  const nums = trimmed.match(/[\d.]+/g)?.map(Number);
  if (nums && nums.length >= 3 && !nums.slice(0, 3).some((n) => Number.isNaN(n))) {
    return [nums[0], nums[1], nums[2], nums[3] ?? 1];
  }

  return [0, 0, 0, 0];
}

/**
 * Converts an RGBA color string to a hex color string.
 * @param rgba - The RGBA color string.
 * @returns The hex color string.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Determines a contrasting text color (black or white) based on the brightness of the background color.
 * @param bgColor - The background color in hex format (e.g., "#RRGGBB" or "#RRGGBBAA").
 * @returns - A hex color string for the contrasting text color.
 */
export function getContrastingTextColor(bgColor: string): string {
  const [r, g, b] = parseRgba(bgColor);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#222" : "#f3f3f3";
}

/**
 * Returns a slightly darker version of a hex color.
 * @param hex - The hex color string (e.g., #RRGGBB)
 * @param amount - How much to darken (0-1, default 0.25)
 * @returns The darkened hex color string.
 */
export function darkenHexColor(color: string, amount = 0.25): string {
  const [r, g, b] = parseRgba(color);
  const factor = 1 - Math.min(1, Math.max(0, amount));
  return rgbToHex(r * factor, g * factor, b * factor);
}

/**
 * Converts a hex or color string to an explicit rgba() string.
 * @param color - The color string (hex, rgb, rgba) to convert.
 * @param alpha - The alpha value (0 to 1) for the rgba color. Default is 1.
 * @returns The color as an rgba() string.
 */
export function hexToRgba(color: string, alpha = 1): string {
  const [r, g, b] = parseRgba(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
