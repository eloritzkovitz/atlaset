interface CardListProps<T = string> {
  items?: T[];
  limit?: number;
  colorClass?: string;
  moreColorClass?: string;
  renderItem?: (item: T) => React.ReactNode;
};

export function CardList<T>({
  items,
  limit = 2,
  colorClass = "bg-blue-100 text-blue-800 dark:bg-gray-400 dark:text-gray-900",
  moreColorClass = "bg-blue-200 text-blue-900 dark:bg-gray-500 dark:text-gray-900",
  renderItem,
}: CardListProps<T>) {
  if (!items || items.length === 0)
    return <span className="text-gray-400 text-xs">—</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {items.slice(0, limit).map((item, idx) => (
        <span
          key={idx}
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${colorClass}`}
        >
          {renderItem ? renderItem(item) : String(item)}
        </span>
      ))}
      {items.length > limit && (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${moreColorClass}`}
        >
          +{items.length - limit} more
        </span>
      )}
    </div>
  );
}
