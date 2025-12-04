import React, { useState } from "react";
import { SortableFilterHeader } from "./SortableFilterHeader";
import type { SortKey } from "@types";

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
  // sortBy format: "key-asc" or "key-desc"
  const [sortBy, setSortBy] = useState<string>("");

  const handleSort = (key: SortKey<T>) => {
    const [currentKey, direction] = sortBy.split("-");
    if (currentKey === key) {
      setSortBy(`${key}-${direction === "desc" ? "asc" : "desc"}`);
    } else {
      setSortBy(`${key}-asc`);
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortBy) return data;
    const [key, direction] = sortBy.split("-");
    return [...data].sort((a, b) => {
      const aVal = a[key as keyof T];
      const bVal = b[key as keyof T];
      if (aVal === undefined || bVal === undefined) return 0;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortBy]);

  return (
    <table className={`min-w-full text-sm ${className}`}>
      <thead>
        <tr className="text-gray-400">
          {columns.map((col) => (
            <th key={col.key as string} className="text-left py-1">
              {col.sortable ? (
                <SortableFilterHeader<T>
                  label={col.label}
                  sortKey={col.key}
                  sortBy={sortBy}
                  onSort={handleSort}
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
        {sortedData.map((row, idx) => (
          <tr
            key={(row as any).id || (row as any).key || idx}
            className="border-t border-gray-800"
          >
            {columns.map((col) => (
              <td key={col.key as string} className="py-1">
                {col.render ? col.render(row) : (row as any)[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
