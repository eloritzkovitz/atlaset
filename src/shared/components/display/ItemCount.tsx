interface ItemCountProps {
  count: number;
  parentheses?: boolean;
  hideZero?: boolean;
  className?: string;
}

/** Displays a secondary count next to an item. */
export function ItemCount({
  count,
  parentheses = true,
  hideZero = true,
  className = "",
}: ItemCountProps) {
  if (hideZero && count === 0) return null;

  return (
    <span className={`ms-1.5 shrink-0 text-xs font-bold text-muted ${className}`}>
      {parentheses ? `(${count})` : count}
    </span>
  );
}
