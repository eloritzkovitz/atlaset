/**
 * Number utility functions
 */

import type { Operator } from "@types";

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
    Math.min(max ?? Number.MAX_SAFE_INTEGER, value),
  );
}

/**
 * Parses a comparator string into an operator and a numeric value.
 * @param input - The comparator string to parse
 * @param pattern - Optional regex pattern for the numeric value (default: "\\d+")
 * @returns An object with the operator and numeric value, or null if parsing fails
 */
export function parseComparator(
  input: string,
  pattern = "\\d+",
): { op: Operator; value: number } | null {
  const re = new RegExp(`^(>=|<=|>|<|=)?\\s*(${pattern})$`);
  const m = input.trim().match(re);
  if (!m) return null;
  const op = (m[1] || "=") as Operator;
  return { op, value: Number(m[2]) };
}

// Parses a year-based comparator string into an operator and a year number.
export function parseYearComparator(
  input: string,
): { op: Operator; year: number } | null {
  const parsed = parseComparator(input, "\\d{4}");
  if (!parsed) return null;
  return { op: parsed.op, year: parsed.value };
}

/**
 * Compares two numeric values based on a comparator operator.
 * @param op - The comparator operator
 * @param a - The first number
 * @param b - The second number
 * @returns The result of the comparison
 */
export function compareNumeric(op: Operator, a: number, b: number) {
  switch (op) {
    case ">":
      return a > b;
    case "<":
      return a < b;
    case ">=":
      return a >= b;
    case "<=":
      return a <= b;
    case "=":
    default:
      return a === b;
  }
}
