import { useRef } from "react";
import { SearchInput, EmptyListMessage } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useUserFriends } from "@features/user";
import { useDebounce } from "@hooks";
import { RecentSearchesList } from "./RecentSearchesList";
import { SearchResultsList } from "./SearchResultsList";
import { useRecentSearches } from "../hooks/useRecentSearches";
import { useSearch } from "../hooks/useSearch";
import { useSyncedSearchTerm } from "../hooks/useSyncedSearchTerm";

interface SearchContentProps {
  onResultSelect?: () => void;
  inputClassName?: string;
  containerClassName?: string;
  hideInput?: boolean;
}

export function SearchContent({
  onResultSelect,
  inputClassName = "",
  containerClassName = "",
  hideInput = false,
}: SearchContentProps) {
  const [searchTerm, setSearchTerm] = useSyncedSearchTerm();
  const debouncedSearchTerm = useDebounce(searchTerm, 100);
  const { results, loading } = useSearch(debouncedSearchTerm);
  const {
    recentSearches,
    saveRecentSearch,
    removeRecentSearch,
    clearAllRecentSearches,
  } = useRecentSearches(5);

  // Get current user and friends for result ranking and display
  const { user: currentUser } = useAuth();
  const { friends: friendList } = useUserFriends(currentUser?.uid);

  // Ref for the search input to manage focus and dropdown behavior
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Handle search term changes
  const handleChange = (val: string) => setSearchTerm(val);

  // Handle search submission
  const handleSearchSubmit = (term: string) => {
    saveRecentSearch(term);
    window.location.assign(`/search?query=${encodeURIComponent(term)}`);
    if (onResultSelect) onResultSelect();
  };

  return (
    <div className={`flex flex-col h-full ${containerClassName}`}>
      {!hideInput && (
        <div className="mb-3">
          <SearchInput
            ref={inputRef}
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search"
            showClear={false}
            className={inputClassName}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchTerm) {
                handleSearchSubmit(searchTerm);
              }
            }}
          />
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <EmptyListMessage message="Searching..." />
        ) : searchTerm ? (
          results.length === 0 ? (
            <EmptyListMessage message="No results found." />
          ) : (
            <SearchResultsList
              results={results}
              searchTerm={searchTerm}
              currentUser={currentUser}
              friendList={friendList}
              setDropdownOpen={() => {}}
              onSearchSubmit={handleSearchSubmit}
            />
          )
        ) : recentSearches.length > 0 ? (
          <RecentSearchesList
            recentSearches={recentSearches}
            onSearchSubmit={handleSearchSubmit}
            onRemove={removeRecentSearch}
            onClear={clearAllRecentSearches}
          />
        ) : null}
      </div>
    </div>
  );
}
