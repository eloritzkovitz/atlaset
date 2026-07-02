import { MenuButton } from "@components";
import { ICONS } from "@constants/icons";
import { getSearchRoute } from "../utils/search";

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
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(term);
  };

  return (
    <MenuButton
      url={getSearchRoute(term)}
      onClick={() => onSelect(term)}
      ariaLabel={`Search for ${term}`}
      className="w-full text-left flex justify-between items-center"
    >
      <span className="flex items-center">
        <ICONS.activity className="me-3 text-muted" />
        {term}
      </span>

      {onRemove && (
        <button
          type="button"
          aria-label={`Delete ${term} from history`}
          className="ms-2 text-muted p-1 rounded hover:bg-hover focus:bg-hover cursor-pointer outline-none border-none bg-transparent"
          onClick={handleRemove}
        >
          <ICONS.close />
        </button>
      )}
    </MenuButton>
  );
}
