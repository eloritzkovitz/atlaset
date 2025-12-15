
import { Chip } from "@components/ui/Chip/Chip";

interface ChipListProps<T = string> {
  items?: T[];
  limit?: number;
  colorClass?: string;
  moreColorClass?: string;
  renderItem?: (item: T) => React.ReactNode;
}

export function ChipList<T>({
  items,
  limit = 2,
  colorClass = "",
  moreColorClass = "bg-surface hover:bg-primary-hover",
  renderItem,
}: ChipListProps<T>) {
  if (!items || items.length === 0)
    return <span className="text-muted text-xs">—</span>;

  return (
    <div className="flex flex-wrap gap-1 select-none">
      {items.slice(0, limit).map((item, idx) => (
        <Chip key={idx} className={`text-xs font-medium ${colorClass}`}>
          {renderItem ? renderItem(item) : String(item)}
        </Chip>
      ))}
      {items.length > limit && (
        <Chip className={`text-xs font-medium ${moreColorClass}`}>
          +{items.length - limit} more
        </Chip>
      )}
    </div>
  );
}
