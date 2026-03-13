import { useRef } from "react";
import { SearchInput, EmptyListMessage } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useCountryData } from "@features/countries";
import { useUserFriends } from "@features/user";
import { useDebounce } from "@hooks";
import { RecentSearchesList } from "./RecentSearchesList";
import { SearchResultsList } from "./SearchResultsList";
import { useSearch } from "../hooks/useSearch";

interface SearchContentProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onSearchSubmit: (term: string) => void;
  recentSearches: string[];
  removeRecentSearch: (term: string) => void;
  clearAllRecentSearches: () => void;
  inputClassName?: string;
  containerClassName?: string;
  hideInput?: boolean;
}

export function SearchContent({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  recentSearches,
  removeRecentSearch,
  clearAllRecentSearches,
  inputClassName = "",
  containerClassName = "",
  hideInput = false,
}: SearchContentProps) {
  const debouncedSearchTerm = useDebounce(searchTerm, 100);
  const { results, loading } = useSearch(debouncedSearchTerm);  

  // Get current user and friends for result ranking and display
  const { user: currentUser } = useAuth();
  const { friends: friendList } = useUserFriends(currentUser?.uid);
  const { countries } = useCountryData();

  // Ref for the search input to manage focus and dropdown behavior
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Handle search term changes
  const handleChange = (val: string) => setSearchTerm(val);  

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
                onSearchSubmit(searchTerm);
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
              countries={countries}
              setDropdownOpen={() => {}}
              onSearchSubmit={onSearchSubmit}
            />
          )
        ) : recentSearches.length > 0 ? (
          <RecentSearchesList
            recentSearches={recentSearches}
            onSearchSubmit={onSearchSubmit}
            onRemove={removeRecentSearch}
            onClear={clearAllRecentSearches}
          />
        ) : null}
      </div>
    </div>
  );
}
