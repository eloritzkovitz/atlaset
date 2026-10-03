import { useRef } from "react";
import { DialogHeader, ResponsiveOverlay } from "@components";
import { ICONS } from "@constants/icons";
import { SearchContent } from "./SearchContent";
import { useSearchController } from "../hooks/useSearchController";

interface SearchPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SearchPanel({ open, onClose }: SearchPanelProps) {
  const search = useSearchController();
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <ResponsiveOverlay
      isOpen={open}
      onClose={onClose}
      triggerRef={triggerRef}
      mobileHeader={
        <DialogHeader
          title={
            <>
              <ICONS.search className="me-2" /> Search
            </>
          }
          onClose={onClose}
          showSeparator={false}
        />
      }
      mobileClassName="!z-[10050]"
    >
      <SearchContent
        searchTerm={search.searchTerm}
        setSearchTerm={search.setSearchTerm}
        onSearchSubmit={search.handleSearchSubmit}
        recentSearches={search.recentSearches}
        removeRecentSearch={search.removeRecentSearch}
        clearAllRecentSearches={search.clearAllRecentSearches}
      />
    </ResponsiveOverlay>
  );
}
