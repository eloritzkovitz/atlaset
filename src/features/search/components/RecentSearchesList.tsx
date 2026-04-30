import { SectionHeader, ActionButton } from "@components";
import { RecentSearchItem } from "./RecentSearchItem";

interface RecentSearchesListProps {
  recentSearches: string[];
  onSearchSubmit: (term: string) => void;
  onRemove: (term: string) => void;
  onClear: () => void;
}

export function RecentSearchesList({
  recentSearches,
  onSearchSubmit,
  onRemove,
  onClear,
}: RecentSearchesListProps) {
  return (
    <div>
      <div className="flex items-center">
        <SectionHeader title="Recent" className="ml-2 flex-1" />
        <ActionButton
          variant="secondary"
          ariaLabel="Clear all recent searches"
          onClick={onClear}
          className="text-muted !text-sm !p-1 mt-2 me-1"
          rounded
        >
          Clear
        </ActionButton>
      </div>
      <ul className="text-left">
        {recentSearches.map((term) => (
          <li key={term}>
            <RecentSearchItem
              term={term}
              onSelect={onSearchSubmit}
              onRemove={onRemove}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
