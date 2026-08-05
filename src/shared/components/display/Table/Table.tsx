import React from "react";
import { useTranslation } from "react-i18next";
import { useSort } from "@hooks";
import type { SortKey } from "@types";
import { sortItems } from "@utils";
import { SortableFilterHeader } from "./SortableFilterHeader";
import { TableToolbar } from "./TableToolbar";
import { getNextSortState, renderCellValue, getRowKey } from "./utils";
import { useTableCopy } from "./useTableCopy";
import { Card } from "../Card/Card";
import { EmptyListMessage } from "../../feedback/EmptyListMessage";

export interface TableColumn<T> {
  key: SortKey<T>;
  label: string;
  labelKey?: string;
  className?: string;
  icon?: React.ElementType;
  iconClass?: string;
  render?: (row: T) => React.ReactNode;
  exportValue?: (row: T) => string | number | boolean | null | undefined;
  sortable?: boolean;
  sortValue?: (row: T) => string | number | boolean | Date | null | undefined;
  filterable?: boolean;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  striped?: boolean;
  showExport?: boolean;
  exportFilename?: string;
  onRowClick?: (row: T) => void;
  cardProps?: Omit<React.ComponentProps<typeof Card>, "children" | "actions">;
  onResetSort?: () => void;
  hasActiveSort?: boolean;
}

/** A responsive table component for displaying tabular data with sorting and filtering capabilities. */
export function Table<T>({
  columns,
  data,
  className = "",
  striped = false,
  showExport = false,
  exportFilename = "export.csv",
  onRowClick,
  cardProps,
  onResetSort,
  hasActiveSort,
}: TableProps<T>) {
  const { t } = useTranslation("common");

  // Sorting state and logic
  const { sortBy, setSortBy, sortedItems } = useSort(
    data,
    (items, sortKeyDir: string) => {
      if (!sortKeyDir) return items;
      const [key, direction] = sortKeyDir.split("-");
      const column = columns.find((c) => String(c.key) === key);

      return sortItems(
        items,
        (item) => {
          if (column?.sortValue) {
            return column.sortValue(item);
          }
          return item[key as keyof T];
        },
        direction === "desc" ? "desc" : "asc",
      );
    },
    "",
  );

  // Reset sorting state either via callback or internal state
  const handleResetSort = () => {
    if (onResetSort) {
      onResetSort();
    } else {
      setSortBy("");
    }
  };

  const isSortActive = hasActiveSort ?? Boolean(sortBy);

  // Copy to clipboard functionality
  const { copyTable } = useTableCopy(sortedItems, columns);

  // Handle sorting when a column header is clicked
  const handleSort = (key: SortKey<T>) => {
    setSortBy(getNextSortState(sortBy, key));
  };

  // Handle row click via keyboard (Enter or Space)
  const handleKeyDown = (e: React.KeyboardEvent, row: T) => {
    if (onRowClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onRowClick(row);
    }
  };

  // If there's no data, show an empty state message
  if (data.length === 0) {
    const emptyMessage = (
      <EmptyListMessage message={t("components.table.emptyMessage")} />
    );
    return cardProps ? (
      <Card {...cardProps}>{emptyMessage}</Card>
    ) : (
      emptyMessage
    );
  }

  // Render the table content
  const tableContent = (
    <div className="overflow-x-auto rounded-lg">
      <table className={`min-w-full text-sm px-4 ${className}`}>
        <thead>
          <tr className="text-muted">
            {columns.map((col) => (
              <th
                key={col.key as string}
                className={`py-2 px-3 font-semibold ${
                  col.className || "text-start"
                }`}
              >
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
        <tbody className="border-separate border-spacing-y-1">
          {sortedItems.map((row, idx) => {
            const isClickable = Boolean(onRowClick);
            const rowBg =
              striped && idx % 2 === 1 ? "bg-transparent" : "bg-muted/10";

            return (
              <tr
                key={getRowKey(row, idx)}
                onClick={() => onRowClick?.(row)}
                onKeyDown={(e) => handleKeyDown(e, row)}
                tabIndex={isClickable ? 0 : undefined}
                role={isClickable ? "button" : undefined}
                className={`transition-colors ${
                  isClickable
                    ? "cursor-pointer hover:bg-surface-hover select-none focus:outline-none focus:ring-1 focus:ring-primary/50"
                    : ""
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key as string}
                    className={`py-2 px-3 ${rowBg} first:rounded-l-xl last:rounded-r-xl transition-colors ${
                      col.className || "text-start"
                    }`}
                  >
                    {col.render
                      ? col.render(row)
                      : renderCellValue(row[col.key as keyof T])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // When cardProps are provided, wrap the table in a Card and slot the toolbar into the Card header actions
  if (cardProps) {
    const toolbar = (
      <TableToolbar
        columns={columns}
        sortedItems={sortedItems}
        hasActiveSort={isSortActive}
        onResetSort={handleResetSort}
        onCopy={copyTable}
        showExport={showExport}
        exportFilename={exportFilename}
      />
    );

    return (
      <Card {...cardProps} actions={toolbar}>
        {tableContent}
      </Card>
    );
  }

  // Pure standalone table without Card or Toolbar
  return tableContent;
}
