/**
 * Utility functions for handling number formatting and operations.
 */

/** Options for formatting percentages. */
export interface FormatPercentOptions {
  decimals?: number;
}

/**
 * Calculates the percentage of a value relative to a denominator and returns it as a string.
 * @param valueOrNumerator - The value or numerator for the percentage calculation.
 * @param denominatorOrOptions - The denominator for the percentage calculation or options for formatting.
 * @param options - Options for formatting the percentage (if denominator is provided).
 * @returns A string representing the percentage, e.g., "25%".
 */
export function formatPercent(
  valueOrNumerator: number,
  denominatorOrOptions?: number | FormatPercentOptions,
  options: FormatPercentOptions = {},
): string {
  let ratio: number;
  let opts: FormatPercentOptions;

  // Determine if the second argument is a number (denominator) or options
  if (typeof denominatorOrOptions === "number") {
    const denominator = denominatorOrOptions;
    ratio = denominator === 0 ? 0 : valueOrNumerator / denominator;
    opts = options;
  } else {
    ratio = valueOrNumerator;
    opts = denominatorOrOptions ?? {};
  }

  // Ensure the ratio is between 0 and 1
  const { decimals = 0 } = opts;
  const percentage = ratio * 100;

  // Format the percentage based on the specified number of decimal places
  if (decimals > 0) {
    return `${percentage.toFixed(decimals)}%`;
  }

  return `${Math.round(percentage)}%`;
}

/** Options for formatting fractions. */
export interface FormatFractionOptions {
  showPercent?: boolean;
  decimals?: number;
}

/**
 * Formats a fraction with optional percentage.
 * @param value - The numerator of the fraction.
 * @param total - The denominator of the fraction.
 * @param options - Options for formatting the fraction and its percentage.
 * @returns A string representing the fraction and its percentage.
 */
export function formatFraction(
  value: number,
  total: number,
  options: FormatFractionOptions = {},
): string {
  const { showPercent = false, decimals = 0 } = options;
  const fraction = `${value}/${total}`;

  if (!showPercent) {
    return fraction;
  }

  return `${fraction} (${formatPercent(value, total, { decimals })})`;
}

/** Options for formatting ranks. */
export interface FormatRankOptions {
  fallback?: string;
  showHash?: boolean;
}

/**
 * Formats a rank number into a string representation.
 * @param rank - The rank number to format.
 * @param options - Options for formatting the rank.
 * @returns A string representing the formatted rank, e.g., "#1" or "—" for invalid ranks.
 */
export function formatRank(
  rank: number | null | undefined,
  options: FormatRankOptions = {},
): string {
  const { fallback = "—", showHash = true } = options;

  if (rank == null || !Number.isFinite(rank) || rank < 1) {
    return fallback;
  }

  const prefix = showHash ? "#" : "";
  return `${prefix}${Math.floor(rank)}`;
}

/**
 * Clamps a number between min and max.
 * @param value - The number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns The clamped number
 */
export function clamp(value: number, min?: number, max?: number): number {
  return Math.max(
    min ?? Number.MIN_SAFE_INTEGER,
    Math.min(max ?? Number.MAX_SAFE_INTEGER, value),
  );
}
