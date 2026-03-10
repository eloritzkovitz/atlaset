import { useState, useRef } from "react";
import { EmptyListMessage, Menu, SearchInput } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useUserFriends } from "@features/user";
import { useClickOutside, useDebounce, useMenuPosition } from "@hooks";
import { RecentSearchesList } from "./RecentSearchesList";
import { SearchResultsList } from "./SearchResultsList";
import { useRecentSearches } from "../hooks/useRecentSearches";
import { useSearch } from "../hooks/useSearch";

export function SearchDropdown() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 100);
  const { results, loading } = useSearch(debouncedSearchTerm);
  const {
    recentSearches,
    saveRecentSearch,
    removeRecentSearch,
    clearAllRecentSearches,
  } = useRecentSearches(5);

  // Dropdown state and refs
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // User and friend data for rendering search results
  const { user: currentUser } = useAuth();
  const { friends: friendList } = useUserFriends(currentUser?.uid);

  // Open dropdown when input is focused
  const handleFocus = () => {
    setDropdownOpen(true);
  };

  // Handle search input changes
  const handleChange = (val: string) => {
    setSearchTerm(val);
    setDropdownOpen(true);
  };

  // Close dropdown when clicking outside
  useClickOutside(
    [
      inputRef as React.RefObject<HTMLElement>,
      dropdownRef as React.RefObject<HTMLElement>,
    ],
    () => setDropdownOpen(false),
    dropdownOpen,
  );

  // Calculate dropdown position
  const menuStyle = useMenuPosition(
    dropdownOpen,
    inputRef as React.RefObject<HTMLElement>,
    dropdownRef as React.RefObject<HTMLElement>,
    42,
    "right",
    true,
  );

  return (
    <div className="relative w-full max-w-xs">
      <SearchInput
        ref={inputRef}
        value={searchTerm}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder="Search"
        showClear={false}
        onKeyDown={(e) => {
          if (e.key === "Enter" && searchTerm) {
            saveRecentSearch(searchTerm);
          }
        }}
      />
      {dropdownOpen && (
        <Menu
          open={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
          containerRef={dropdownRef}
          disableScroll
          style={menuStyle}
        >
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
                setDropdownOpen={setDropdownOpen}
              />
            )
          ) : recentSearches.length > 0 ? (
            <RecentSearchesList
              recentSearches={recentSearches}
              handleChange={handleChange}
              saveRecentSearch={saveRecentSearch}
              removeRecentSearch={removeRecentSearch}
              clearAllRecentSearches={clearAllRecentSearches}
            />
          ) : null}
        </Menu>
      )}
    </div>
  );
}
