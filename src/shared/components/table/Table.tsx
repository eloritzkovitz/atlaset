import React from "react";
import { useSort } from "@hooks/useSort";
import type { SortKey } from "@types";
import { sortItems } from "@utils/sort";
import { SortableFilterHeader } from "./SortableFilterHeader";

export interface TableColumn<T> {
  key: SortKey<T>;
  label: string;
  icon?: React.ElementType;
  iconClass?: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export function Table<T>({
  columns,
  data,
  className = "",
}: {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
}) {
  // Sorting state and logic
  const { sortBy, setSortBy, sortedItems } = useSort(
    data,
    (items, sortKeyDir: string) => {
      if (!sortKeyDir) return items;
      const [key, direction] = sortKeyDir.split("-");
      return sortItems(
        items,
        (item) => item[key as keyof T],
        direction === "desc" ? "desc" : "asc"
      );
    },
    "" // initial sort
  );

  // Handle sorting when a column header is clicked
  const handleSort = (key: SortKey<T>) => {
    const [currentKey, direction] = (sortBy || "").split("-");
    if (currentKey === key) {
      setSortBy(`${key}-${direction === "desc" ? "asc" : "desc"}`);
    } else {
      setSortBy(`${key}-asc`);
    }
  };

  // Helper to render cell values
  function renderCellValue(value: unknown): React.ReactNode {
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

  return (
    <table className={`min-w-full text-sm ${className}`}>
      <thead>
        <tr className="text-muted">
          {columns.map((col) => (
            <th key={col.key as string} className="text-left py-1">
              {col.sortable ? (
                <SortableFilterHeader<T>
                  label={col.label}
                  sortKey={col.key}
                  sortBy={sortBy}
                  onSort={handleSort}
                  icon={col.icon}
                  iconClass={col.iconClass}
                />
              ) : (
                <span className="flex items-center gap-1">
                  {col.icon && (
                    <col.icon
                      className={`inline-block ${col.iconClass || ""}`}
                    />
                  )}
                  {col.label}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedItems.map((row, idx) => (
          <tr
            key={
              typeof row === "object" && row !== null && "id" in row
                ? (row as { id: React.Key }).id
                : typeof row === "object" && row !== null && "key" in row
                ? (row as { key: React.Key }).key
                : idx
            }
            className="border-t border-muted/40"
          >
            {columns.map((col) => (
              <td key={col.key as string} className="px-4 py-2">
                {col.render
                  ? col.render(row)
                  : renderCellValue(row[col.key as keyof T])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
