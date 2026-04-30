import { ActionButton, Panel } from "@components";
import { ICONS } from "@constants/icons";
import { SearchContent } from "./SearchContent";
import { useSearchController } from "../hooks/useSearchController";

interface SearchPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SearchPanel({ open, onClose }: SearchPanelProps) {
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
      headerActions={
        <ActionButton
          onClick={onClose}
          ariaLabel="Close search panel"
          title="Close"
          icon={<ICONS.close className="text-2xl" />}
          rounded
        />
      }
      className="!z-[10050]"
      showSeparator={false}
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
