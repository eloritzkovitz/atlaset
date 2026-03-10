import { useState, useRef } from "react";
import { EmptyListMessage, Menu, SearchInput } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useUserFriends } from "@features/user";
import { useClickOutside, useDebounce, useMenuPosition } from "@hooks";
import { useSearch } from "../hooks/useSearch";
import { renderSearchItem } from "../utils/renderSearchItem";

export function SearchDropdown() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // User and friend data for rendering search results
  const { user: currentUser } = useAuth();
  const { friends: friendList } = useUserFriends(currentUser?.uid);

  // Refs for input and dropdown elements
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Debounce search term to reduce query frequency
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { results, loading } = useSearch(debouncedSearchTerm);

  // Open dropdown when searchTerm is non-empty and input is focused
  const handleFocus = () => {
    if (searchTerm) setDropdownOpen(true);
  };

  // Handle search input changes
  const handleChange = (val: string) => {
    setSearchTerm(val);
    if (val) setDropdownOpen(true);
    else setDropdownOpen(false);
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
        placeholder="Search"
        onFocus={handleFocus}
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
          ) : results.length === 0 ? (
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
          )}
        </Menu>
      )}
    </div>
  );
}
