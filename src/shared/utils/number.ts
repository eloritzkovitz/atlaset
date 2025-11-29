/**
 * Number utility functions
 */

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
