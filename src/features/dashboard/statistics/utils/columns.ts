import type { TableColumn } from "@components";

/**
 * Generic translator for LocalTableColumn -> TableColumn
 * Uses `defaultLabel` as a safe fallback so no `any` casts are needed.
 */
export function translateColumns<T>(
  cols: TableColumn<T>[],
  t: (k: string, o?: Record<string, unknown>) => string,
): TableColumn<T>[] {
  return cols.map((c) => ({
    ...c,
    label: c.labelKey
      ? t(c.labelKey, { defaultValue: c.label ?? "" })
      : (c.label ?? ""),
  }));
}
