import type { TableColumn } from "@components";

/**
 * Translates table column labels using `labelKey` if provided, otherwise falls back to the existing `label`.
 * @param cols - Array of table columns to translate.
 * @param t - Translation function.
 * @returns New array of table columns with translated labels.
 */
export function translateColumns<T>(
  cols: TableColumn<T>[],
  t: (k: string, o?: Record<string, unknown>) => string,
): TableColumn<T>[] {
  return cols.map((c) => {
    if (!c.labelKey) {
      return c;
    }

    // Ensure fallback to defaultValue is purely string-safe for i18next
    const fallbackLabel = typeof c.label === "string" ? c.label : "";

    return {
      ...c,
      label: t(c.labelKey, { defaultValue: fallbackLabel }),
    };
  });
}
