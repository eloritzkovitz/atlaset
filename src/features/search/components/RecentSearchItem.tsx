import { FaRegClock, FaXmark } from "react-icons/fa6";
import { ActionButton, MenuButton } from "@components";

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
        <FaRegClock className="mr-3 text-muted" />
        {term}
      </span>
      {onRemove && (
        <ActionButton
          icon={<FaXmark />}
          ariaLabel={`Delete ${term} from history`}
          className="ml-2 text-muted"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(term);
          }}
          rounded
        />
      )}
    </MenuButton>
  );
}
