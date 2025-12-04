import React from "react";

export interface TableColumn {
  key: string;
  label: string;
  icon?: React.ElementType;
  iconClass?: string;
  render?: (row: any) => React.ReactNode;
}

export function Table({
  columns,
  data,
  className = "",
}: {
  columns: TableColumn[];
  data: any[];
  className?: string;
}) {
  return (
    <table className={`min-w-full text-sm ${className}`}>
      <thead>
        <tr className="text-gray-400">
          {columns.map((col) => (
            <th key={col.key} className="text-left py-1">
              <span className="flex items-center gap-1">
                {col.icon && (
                  <col.icon className={`inline-block ${col.iconClass || ""}`} />
                )}
                {col.label}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr
            key={row.id || row.key || idx}
            className="border-t border-gray-800"
          >
            {columns.map((col) => (
              <td key={col.key} className="py-1">
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
