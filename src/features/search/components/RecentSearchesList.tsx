import { SectionHeader, ActionButton } from "@components";
import { RecentSearchItem } from "./RecentSearchItem";

interface RecentSearchesListProps {
  recentSearches: string[];
  handleChange: (val: string) => void;
  saveRecentSearch: (term: string) => void;
  removeRecentSearch: (term: string) => void;
  clearAllRecentSearches: () => void;
}

export function RecentSearchesList({
  recentSearches,
  handleChange,
  saveRecentSearch,
  removeRecentSearch,
  clearAllRecentSearches,
}: RecentSearchesListProps) {
  return (
    <div>
      <div className="flex items-center">
        <SectionHeader title="Recent" className="ml-2 flex-1" />
        <ActionButton
          variant="secondary"
          ariaLabel="Clear all recent searches"
          onClick={clearAllRecentSearches}
          className="text-muted !text-sm !p-1 mt-2 mr-1"
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
              onSelect={(selectedTerm) => {
                handleChange(selectedTerm);
                saveRecentSearch(selectedTerm);
              }}
              onClear={(clearedTerm) => removeRecentSearch(clearedTerm)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
