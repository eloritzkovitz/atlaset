import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Menu, SearchInput } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useClickOutside, useMenuPosition } from "@hooks";
import { SearchContent } from "./SearchContent";
import { useSearchController } from "../hooks/useSearchController";

/** Renders the search dropdown. */
export function SearchDropdown() {
  const { user } = useAuth();
  const search = useSearchController();
  const { t } = useTranslation();

  // Dropdown state and refs
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
    "overlay",
    true,
  );

  // Shared search submit handler
  const handleSearchSubmit = (term: string) => {
    if (term) {
      setDropdownOpen(false);
      search.handleSearchSubmit(term);
    }
  };

  // Determine if SearchContent will render anything
  const hasContent = !!search.searchTerm || !!search.recentSearches.length;

  // Don't render if no user
  if (!user) return null;

  return (
    <div className="relative w-full max-w-xs">
      <SearchInput
        ref={inputRef}
        value={search.searchTerm}
        onChange={search.setSearchTerm}
        onFocus={handleFocus}
        placeholder={t("search.placeholder")}
        showClear={false}
        onKeyDown={(e) => {
          if (e.key === "Enter" && search.searchTerm) {
            handleSearchSubmit(search.searchTerm);
          }
        }}
      />
      {dropdownOpen && hasContent && (
        <Menu
          open={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
          containerRef={dropdownRef}
          disableScroll
          style={menuStyle}
        >
          <SearchContent
            searchTerm={search.searchTerm}
            setSearchTerm={search.setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
            recentSearches={search.recentSearches}
            removeRecentSearch={search.removeRecentSearch}
            clearAllRecentSearches={search.clearAllRecentSearches}
            hideInput
          />
        </Menu>
      )}
    </div>
  );
}
