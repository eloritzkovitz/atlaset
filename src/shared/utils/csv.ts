/**
 * Utility functions for working with CSV data.
 */

/** Represents a column in the CSV output. */
export interface CSVColumn<T> {
  header: string;
  accessor:
    | keyof T
    | ((row: T) => string | number | boolean | null | undefined);
}

/**
 * Exports an array of data to a CSV file and triggers a download.
 * @param data - The array of data to export.
 * @param columns - The columns to include in the CSV, with headers and accessors.
 * @param filename - The name of the file to download.
 */
export function exportToCSV<T>(
  data: T[],
  columns: CSVColumn<T>[],
  filename: string = "export.csv",
) {
  if (!data.length) return;

  // Render headers
  const headers = columns
    .map((col) => `"${col.header.replace(/"/g, '""')}"`)
    .join(",");

  // Render rows
  const rows = data.map((row) =>
    columns
      .map((col) => {
        let val: unknown;
        if (typeof col.accessor === "function") {
          val = col.accessor(row);
        } else {
          val = row[col.accessor];
        }

        const stringVal = val ?? "";
        return `"${String(stringVal).replace(/"/g, '""')}"`;
      })
      .join(","),
  );

  const csvContent = [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    filename.endsWith(".csv") ? filename : `${filename}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
