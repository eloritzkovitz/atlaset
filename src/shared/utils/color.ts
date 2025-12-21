/**
 * @file Utility functions for color manipulation.
 */

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
