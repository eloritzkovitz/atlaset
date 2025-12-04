import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";
import { SearchInput } from "@components";
import type { SortKey } from "@types";

interface SortableFilterHeaderProps<T> {
  label: string;
  sortKey: SortKey<T>;
  sortBy: string;
  onSort: (key: SortKey<T>) => void;
  icon?: React.ElementType;
  iconClass?: string;
  filterable?: boolean;
  filterValue?: string;
  onFilterChange?: (v: string) => void;
  placeholder?: string;
  filterElement?: React.ReactNode;
  children?: React.ReactNode;
}

export function SortableFilterHeader<T>({
  label,
  sortKey,
  sortBy,
  onSort,
  icon: Icon,
  iconClass,
  filterable = false,
  filterValue,
  onFilterChange,
  placeholder = "Filter",
  filterElement,
}: SortableFilterHeaderProps<T>) {
  const [currentKey, direction] = sortBy.split("-");
  const isActive = currentKey === sortKey;
  const isAsc = direction !== "desc";

  return (
    <div
      className={`flex flex-col items-stretch min-w-[10px] ${
        filterable ? "h-full " : "h-10"
      }`}
    >
      <button
        type="button"
        className="flex items-center justify-between w-full px-2 pt-2 pb-1 bg-transparent border-0 font-semibold text-left cursor-pointer select-none"
        onClick={() => onSort(sortKey)}
        tabIndex={-1}
      >
        <span className="flex items-center gap-1">
          {Icon && <Icon className={`inline-block mr-2 ${iconClass}`} />}
          {label}
        </span>
        <span>
          {!isActive ? (
            <FaSort className="inline ml-1" />
          ) : isAsc ? (
            <FaSortUp className="inline ml-1" />
          ) : (
            <FaSortDown className="inline ml-1" />
          )}
        </span>
      </button>
      <div className="px-2 pt-1 min-h-[36px] flex items-center">
        {filterElement
          ? filterElement
          : onFilterChange && (
              <SearchInput
                value={filterValue || ""}
                onChange={onFilterChange}
                placeholder={placeholder}
                className="w-full text-xs opacity-70"
              />
            )}
      </div>
    </div>
  );
}
