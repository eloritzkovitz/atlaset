import { Chip } from "./Chip";
import { Tooltip } from "../Tooltip/Tooltip";
import { useTranslation } from "react-i18next";

interface ChipListProps<T = string> {
  items?: T[];
  limit?: number;
  colorClass?: string;
  moreColorClass?: string;
  renderItem?: (item: T) => React.ReactNode;
  removable?: boolean;
  onRemove?: (item: T) => void;
}

/** Renders a list of chips. */
export function ChipList<T>({
  items,
  limit = 2,
  colorClass = "",
  moreColorClass = "bg-surface hover:bg-primary-hover",
  renderItem,
  removable = false,
  onRemove,
}: ChipListProps<T>) {
  const { t } = useTranslation("common");

  if (!items || items.length === 0)
    return <span className="text-muted text-xs">—</span>;

  return (
    <div className="flex flex-wrap gap-1 select-none">
      {items.slice(0, limit).map((item, idx) => (
        <Chip
          key={idx}
          className={`text-xs font-medium ${colorClass}`}
          removable={removable}
          onRemove={() => onRemove && onRemove(item)}
        >
          {renderItem ? renderItem(item) : String(item)}
        </Chip>
      ))}
      {items.length > limit && (
        <Tooltip
          content={items
            .slice(limit)
            .map((item) => {
              if (typeof item === "object" && item !== null) {
                if (
                  "label" in item &&
                  typeof (item as { label: unknown }).label === "string"
                ) {
                  return (item as { label: string }).label;
                }
                if (
                  "value" in item &&
                  typeof (item as { value: unknown }).value === "string"
                ) {
                  return (item as { value: string }).value;
                }
              }
              return String(item);
            })
            .join("\n")}
          position="bottom"
        >
          <Chip className={`text-xs font-medium ${moreColorClass}`}>
            {t("chip.more", { count: items.length - limit })}
          </Chip>
        </Tooltip>
      )}
    </div>
  );
}
