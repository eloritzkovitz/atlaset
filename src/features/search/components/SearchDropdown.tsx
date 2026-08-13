import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Menu, SearchInput } from "@components";
import { useAuth } from "@features/user/auth";
import { useClickOutside, useDisclosure, useMenuPosition } from "@hooks";
import { SearchContent } from "./SearchContent";
import { useSearchController } from "../hooks/useSearchController";

/** Renders the search dropdown. */
export function SearchDropdown() {
  const { user } = useAuth();
  const search = useSearchController();
  const { t } = useTranslation();

  const dropdown = useDisclosure();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Open dropdown when input is clicked
  const handleInputClick = (e: React.MouseEvent) => {
    if (e.button === 0) {
      dropdown.open();
    }
  };

  // Close dropdown when clicking outside
  useClickOutside([wrapperRef, dropdownRef], dropdown.close, dropdown.isOpen);

  // Determine if SearchContent will render anything
  const hasContent = !!search.searchTerm || !!search.recentSearches.length;

  // Calculate dropdown position using the custom hook
  const menuStyle = useMenuPosition(
    dropdown.isOpen,
    wrapperRef,
    dropdownRef,
    42,
    "right",
    "overlay",
    hasContent,
  );

  // Force a re-render when the dropdown opens and has content to ensure proper positioning
  const [, triggerUpdate] = useState({});
  useEffect(() => {
    if (dropdown.isOpen && hasContent) {
      const frame = requestAnimationFrame(() => triggerUpdate({}));
      return () => cancelAnimationFrame(frame);
    }
  }, [dropdown.isOpen, hasContent, search.searchTerm]);

  const handleSearchSubmit = (term: string) => {
    if (term) {
      dropdown.close();
      search.handleSearchSubmit(term);
    }
  };

  // Don't render if no user
  if (!user) return null;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xs">
      <SearchInput
        ref={inputRef}
        value={search.searchTerm}
        onChange={search.setSearchTerm}
        onClick={handleInputClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" && search.searchTerm) {
            handleSearchSubmit(search.searchTerm);
          }
        }}
        placeholder={t("components.search.placeholder")}
        showClear={false}
      />
      {dropdown.isOpen && hasContent && (
        <Menu
          open={dropdown.isOpen}
          onClose={dropdown.close}
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
