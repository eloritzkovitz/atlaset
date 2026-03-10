import { useState, useRef } from "react";
import {
  EmptyListMessage,
  Menu,
  SearchInput,
  SectionHeader,
} from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useUserFriends } from "@features/user";
import { useClickOutside, useDebounce, useMenuPosition } from "@hooks";
import { useSearch } from "../hooks/useSearch";
import { renderSearchItem } from "../utils/renderSearchItem";
import { useRecentSearches } from "../hooks/useRecentSearches";
import { RecentSearchItem } from "./RecentSearchItem";
import { ActionButton } from "@components/action/ActionButton";

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
              <ul className="text-left">
                {results.map((item) =>
                  renderSearchItem(item, {
                    navigate: (url) => window.location.assign(url),
                    setDropdownOpen,
                    currentUser: currentUser,
                    friendList: friendList,
                  }),
                )}
              </ul>
            )
          ) : recentSearches.length > 0 ? (
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
          ) : null}
        </Menu>
      )}
    </div>
  );
}
