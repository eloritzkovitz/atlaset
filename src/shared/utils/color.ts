/**
 * @file Utility functions for color manipulation.
 */

/**
 * Converts an rgba() string to a hex string (with alpha).
 * @param rgba - The rgba color string.
 * @returns The hex color string.
 */
export function rgbaToHex(input: string): string {
  // Match rgb(...) and rgba(..., alpha)
  const rgbMatch = input.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    if ([r, g, b].some((v) => v < 0 || v > 255)) return input;
    const a = 255;
    return (
      "#" +
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0") +
      a.toString(16).padStart(2, "0")
    ).toLowerCase();
  }

  // Match rgba(..., alpha)
  const rgbaMatch = input.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([^)]*)\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1], 10);
    const g = parseInt(rgbaMatch[2], 10);
    const b = parseInt(rgbaMatch[3], 10);
    if ([r, g, b].some((v) => v < 0 || v > 255)) return input;
    const alphaValue = parseFloat(rgbaMatch[4]);
    const a = isNaN(alphaValue) ? 255 : Math.floor(alphaValue * 255);
    return (
      "#" +
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0") +
      a.toString(16).padStart(2, "0")
    ).toLowerCase();
  }
  // If not rgb(...) or rgba(..., alpha), return original string
  return input;
}

/**
 * Converts a hex color string to an rgba string.
 * @param hex - The hex color string.
 * @param alpha - The alpha value (default 1).
 * @returns The rgba color string.
 */
export function hexToRgba(hex: string, alpha = 1): string {
  let r = 0,
    g = 0,
    b = 0;
  if (typeof hex !== "string") return `rgba(0, 0, 0, ${alpha})`;
  if (hex.startsWith("#")) hex = hex.trim();

  if (/^#[0-9A-Fa-f]{3}$/.test(hex)) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  } else {
    // Invalid hex, return black
    return `rgba(0, 0, 0, ${alpha})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Converts [r, g, b] to hex string.
 */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  );
}

/**
 * Parses an RGBA color string into its component values.
 * @param rgba - The RGBA color string to parse.
 * @returns An array containing the red, green, blue, and alpha values.
 */
export function parseRgba(rgba: string): [number, number, number, number] {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/);
  if (!match) return [255, 255, 255, 1];
  return [
    parseInt(match[1], 10),
    parseInt(match[2], 10),
    parseInt(match[3], 10),
    parseFloat(match[4]),
  ];
}

/**
 * Parses a hex color string (e.g., #RRGGBB) into [r, g, b]. Returns null if invalid.
 */
function parseHexColor(hex: string): [number, number, number] | null {
  const color = hex.replace("#", "");
  if (color.length !== 6) return null;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  if ([r, g, b].some((v) => isNaN(v))) return null;
  return [r, g, b];
}

/**
 * Blends multiple RGBA colors together.
 * @param colors - An array of RGBA color strings to blend.
 * @returns The blended RGBA color as a string.
 */
export function blendColors(colors: string[]): string {
  const base = [255, 255, 255, 1];
  for (const rgba of colors) {
    const [r, g, b, a] = parseRgba(rgba);
    base[0] = Math.round(r * a + base[0] * (1 - a));
    base[1] = Math.round(g * a + base[1] * (1 - a));
    base[2] = Math.round(b * a + base[2] * (1 - a));
    base[3] = 1;
  }
  return (
    "#" +
    base
      .slice(0, 3)
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

/**
 * Determines a contrasting text color (black or white) based on the brightness of the background color.
 * @param bgColor - The background color in hex format (e.g., "#RRGGBB" or "#RRGGBBAA").
 * @returns - A hex color string for the contrasting text color.
 */
export function getContrastingTextColor(bgColor: string): string {
  const rgb = parseHexColor(bgColor);
  if (!rgb) return "#222";
  const [r, g, b] = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#222" : "#f3f3f3";
}

/**
 * Returns a slightly darker version of a hex color.
 * @param hex - The hex color string (e.g., #RRGGBB)
 * @param amount - How much to darken (0-1, default 0.25)
 * @returns The darkened hex color string.
 */
export function darkenHexColor(hex: string, amount = 0.25): string {
  const rgb = parseHexColor(hex);

  // If parsing fails, return original hex
  if (!rgb) return hex;

  // Darken each channel by the specified amount
  let [r, g, b] = rgb;
  r = Math.max(0, Math.floor(r * (1 - amount)));
  g = Math.max(0, Math.floor(g * (1 - amount)));
  b = Math.max(0, Math.floor(b * (1 - amount)));

  return rgbToHex(r, g, b);
}
