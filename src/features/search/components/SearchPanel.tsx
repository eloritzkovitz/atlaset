import { Panel } from "@components";
import { ICONS } from "@constants/icons";
import { useAccessibility } from "@features/settings/accessibility";
import { SearchContent } from "./SearchContent";
import { useSearchController } from "../hooks/useSearchController";

interface SearchPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SearchPanel({ open, onClose }: SearchPanelProps) {
  const { animationsEnabled } = useAccessibility();
  const search = useSearchController();

  return (
    <Panel
      show={open}
      onHide={onClose}
      position="right"
      title={
        <>
          <ICONS.search className="me-2" /> Search
        </>
      }
      className="!z-[10050]"
      showSeparator={false}
      animationsEnabled={animationsEnabled}
    >
      <SearchContent
        searchTerm={search.searchTerm}
        setSearchTerm={search.setSearchTerm}
        onSearchSubmit={search.handleSearchSubmit}
        recentSearches={search.recentSearches}
        removeRecentSearch={search.removeRecentSearch}
        clearAllRecentSearches={search.clearAllRecentSearches}
        containerClassName="!z-[10051]"
      />
    </Panel>
  );
}
