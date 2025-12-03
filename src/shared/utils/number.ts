/**
 * Number utility functions
 */

/**
 * Format a percentage as a string (e.g. 75%).
 * @param x - Numerator
 * @param y - Denominator
 * @returns Percentage string
 */
export function percent(x: number, y: number): string {
  return y === 0 ? "0%" : `${Math.round((x / y) * 100)}%`;
}

/**
 * Clamp a number between min and max.
 * @param value - The number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns The clamped number
 */
export function clamp(value: number, min?: number, max?: number): number {
  return Math.max(
    min ?? Number.MIN_SAFE_INTEGER,
    Math.min(max ?? Number.MAX_SAFE_INTEGER, value)
  );
}
