/**
 * Utility functions for comparing numeric values and parsing comparator strings.
 */

import type { Operator } from "@types";

/**
 * Parses a comparator string into an operator and a numeric value.
 * @param input - The comparator string to parse.
 * @param pattern - Optional regex pattern for the numeric value (default: "\\d+").
 * @returns An object with the operator and numeric value, or null if parsing fails.
 */
export function parseComparator(
  input: string,
  pattern = "\\d+",
): { op: Operator; value: number } | null {
  const re = new RegExp(`^(>=|<=|>|<|=|~)?\\s*(${pattern})$`);
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
 * Compares two numeric values based on a comparator operator. Supports `~` for approximate comparisons.
 * @param op - The comparator operator.
 * @param a - The first number.
 * @param b - The second number.
 * @param tolerance - Optional tolerance for `~`. Defaults to 0.05.
 * @returns The result of the comparison.
 */
export function compareNumeric(
  op: Operator,
  a: number,
  b: number,
  tolerance?: number,
) {
  switch (op) {
    case ">":
      return a > b;
    case "<":
      return a < b;
    case ">=":
      return a >= b;
    case "<=":
      return a <= b;
    case "~": {
      const frac = typeof tolerance === "number" ? tolerance : 0.05;
      const scale = Math.max(Math.abs(a), Math.abs(b));
      const allowed = scale < 1 ? frac : frac * scale;
      return Math.abs(a - b) <= allowed;
    }
    case "=":
    default:
      return a === b;
  }
}
