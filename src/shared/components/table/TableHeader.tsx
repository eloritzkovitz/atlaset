import React from "react";

interface TableHeaderProps extends React.ThHTMLAttributes<HTMLElement> {
  unsortable?: boolean;
  colKey?: string;
  renderResizeHandle?: (key: string) => React.ReactNode;
}

export function TableHeader({
  unsortable,
  className = "",
  colKey,
  renderResizeHandle,
  children,
  ...props
}: TableHeaderProps) {
  return (
    <th
      className={`sticky top-0 px-2 bg-gray-100 dark:bg-gray-900 z-3 ${
        unsortable ? " text-left pb-7 " : "py-1 "
      } ${className}`}
      {...props}
    >
      {children}
      {colKey && renderResizeHandle && renderResizeHandle(colKey)}
    </th>
  );
}
