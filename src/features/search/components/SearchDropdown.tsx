import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Menu, SearchInput } from "@components";
import { useAuth } from "@features/user/auth";
import {
  useBodyScrollLock,
  useClickOutside,
  useDisclosure,
  useMenuPosition,
} from "@hooks";
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

  useBodyScrollLock(dropdown.isOpen);

  const handleInputClick = (e: React.MouseEvent) => {
    if (e.button === 0) {
      dropdown.open();
    }
  };

  useClickOutside([wrapperRef, dropdownRef], dropdown.close, dropdown.isOpen);

  // Determine if SearchContent will render anything
  const hasContent = !!search.searchTerm || !!search.recentSearches.length;

  const menuStyle = useMenuPosition(
    dropdown.isOpen,
    wrapperRef,
    dropdownRef,
    42,
    "right",
    "overlay",
    hasContent,
  );

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
          containerRef={dropdownRef}
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
