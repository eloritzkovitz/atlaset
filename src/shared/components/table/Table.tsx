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
        (item) => (item as any)[key],
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
            key={(row as any).id || (row as any).key || idx}
            className="border-t border-gray-100 dark:border-gray-700"
          >
            {columns.map((col) => (
              <td key={col.key as string} className="px-4 py-2">
                {col.render ? col.render(row) : (row as any)[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
