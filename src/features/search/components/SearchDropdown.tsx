import { useState, useRef } from "react";
import { Menu } from "@components";
import { useClickOutside, useMenuPosition } from "@hooks";
import { SearchContent } from "./SearchContent";
import { SearchInput } from "@components";
import { useSyncedSearchTerm } from "../hooks/useSyncedSearchTerm";

/** Renders the search dropdown, which contains the SearchContent component. */
export function SearchDropdown() {
  // Dropdown state and refs
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useSyncedSearchTerm();

  // Open dropdown when input is focused
  const handleFocus = () => {
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
        onChange={setSearchTerm}
        onFocus={handleFocus}
        placeholder="Search"
        showClear={false}
        onKeyDown={(e) => {
          if (e.key === "Enter" && searchTerm) {
            setDropdownOpen(false);
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
          <SearchContent hideInput />
        </Menu>
      )}
    </div>
  );
}
