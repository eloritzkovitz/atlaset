interface TableCellProps {
  children: React.ReactNode;
  rowSpan?: number;
  className?: string;
}

export function TableCell({
  children,
  rowSpan = 1,
  className = "px-2 py-2",
}: TableCellProps) {
  return (
    <td className={className} rowSpan={rowSpan}>
      {children}

      <div className="absolute right-0 top-0 w-[6px] h-full cursor-col-resize z-[100] select-none bg-transparent" />
    </td>
  );
}
