import { FaRegClock, FaXmark } from "react-icons/fa6";
import { ActionButton, MenuButton } from "@components";

interface RecentSearchItemProps {
  term: string;
  onSelect: (term: string) => void;
  onClear?: (term: string) => void;
}

export function RecentSearchItem({
  term,
  onSelect,
  onClear,
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
      {onClear && (
        <ActionButton
          icon={<FaXmark />}
          ariaLabel={`Delete ${term} from history`}
          className="ml-2 text-muted"
          onClick={(e) => {
            e.stopPropagation();
            onClear(term);
          }}
          rounded
        />
      )}
    </MenuButton>
  );
}
