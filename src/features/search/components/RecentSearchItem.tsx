import { FaRegClock, FaXmark } from "react-icons/fa6";
import { MenuButton } from "@components";

interface RecentSearchItemProps {
  term: string;
  onSelect: (term: string) => void;
  onRemove?: (term: string) => void;
}

export function RecentSearchItem({
  term,
  onSelect,
  onRemove,
}: RecentSearchItemProps) {
  return (
    <MenuButton
      onClick={() => onSelect(term)}
      icon={null}
      ariaLabel={`Search for ${term}`}
      className="w-full text-left flex justify-between items-center"
    >
      <span className="flex items-center">
        <FaRegClock className="me-3 text-muted" />
        {term}
      </span>
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          aria-label={`Delete ${term} from history`}
          className="ms-2 text-muted p-1 rounded hover:bg-hover focus:bg-hover cursor-pointer outline-none"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(term);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onRemove(term);
            }
          }}
        >
          <FaXmark />
        </span>
      )}
    </MenuButton>
  );
}
