import React from "react";
import type { SortKey } from "@types";
import { exportToCSV, type CSVColumn } from "@utils";
import type { TableColumn } from "./Table";

/**
 * Resolves a React key for a given row item.
 * @param row - The data row for which to get the key.
 * @param index - The index of the row in the data array.
 * @returns A unique React key for the row.
 */
export function getRowKey<T>(row: T, index: number): React.Key {
  if (typeof row === "object" && row !== null) {
    if ("id" in row && (row as { id: React.Key }).id != null) {
      return (row as { id: React.Key }).id;
    }
    if ("key" in row && (row as { key: React.Key }).key != null) {
      return (row as { key: React.Key }).key;
    }
  }
  return index;
}

/**
 * Renders a cell value for display in the table.
 * @param value - The cell value to render.
 * @returns The rendered cell value as a React node.
 */
export function renderCellValue(value: unknown): React.ReactNode {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    React.isValidElement(value) ||
    value == null
  ) {
    return value as React.ReactNode;
  }
  return JSON.stringify(value);
}

/**
 * Calculates the next sort state string given the current sort state and clicked column key.
 */
export function getNextSortState<T>(
  currentSortBy: string,
  targetKey: SortKey<T>,
): string {
  const [currentKey, direction] = (currentSortBy || "").split("-");
  if (currentKey === targetKey) {
    return `${String(targetKey)}-${direction === "desc" ? "asc" : "desc"}`;
  }
  return `${String(targetKey)}-asc`;
}

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

/**
 * Formats the given table data into a TSV (Tab-Separated Values) string using the provided columns for headers and accessors.
 * @param data - The array of data to format.
 * @param columns - The columns to include in the TSV, with headers and accessors.
 * @returns A string representing the table data in TSV format.
 */
export function formatTableToTSV<T>(
  data: T[],
  columns: TableColumn<T>[],
): string {
  if (!data.length || !columns.length) return "";

  const headers = columns.map((col) => col.label).join("\t");

  const rows = data.map((row) =>
    columns
      .map((col) => {
        let value: unknown;

        if (col.exportValue) {
          value = col.exportValue(row);
        } else if (col.sortValue) {
          value = col.sortValue(row);
        } else {
          value = row[col.key as keyof T];
        }

        if (value === null || value === undefined) return "";
        return String(value).replace(/[\t\r\n]/g, " ");
      })
      .join("\t"),
  );

  return [headers, ...rows].join("\n");
}

/**
 * Exports the given table data to a CSV file using the provided columns for headers and accessors.
 * @param data - The array of data to export.
 * @param columns - The columns to include in the CSV, with headers and accessors.
 * @param filename - The name of the file to download.
 */
export function exportTableToCSV<T>(
  data: T[],
  columns: TableColumn<T>[],
  filename: string = "table-export.csv",
) {
  const csvColumns: CSVColumn<T>[] = columns.map((col) => ({
    header: col.label,
    accessor: (row) => {
      if (col.exportValue) return col.exportValue(row);
      return row[col.key as keyof T] as
        | string
        | number
        | boolean
        | null
        | undefined;
    },
  }));

  exportToCSV(data, csvColumns, filename);
}
