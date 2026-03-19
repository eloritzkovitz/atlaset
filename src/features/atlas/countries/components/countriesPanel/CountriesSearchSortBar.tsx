import { useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { SearchInput, SegmentedToggle, ActionButton } from "@components";
import { useTimeline } from "@contexts/TimelineContext";
import { CountrySortSelect } from "@features/countries/components/countrySort/CountrySortSelect";
import { useDragScroll } from "@hooks";

interface CountriesSearchSortBarProps {
  search: string;
  setSearch: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  allCount?: number;
  sovereignCount?: number;
  sovereignOnly?: boolean;
  setSovereignOnly?: (value: boolean) => void;
  visitedCount?: number;
  visitedOnly?: boolean;
  setVisitedOnly?: (value: boolean) => void;
  countryLists?: { id: string; name: string; countryCodes: string[] }[];
  selectedListId?: string | null;
  setSelectedListId?: (id: string | null) => void;
}

export function CountriesSearchSortBar({
  search,
  setSearch,
  sortBy,
  setSortBy,
  allCount = 0,
  sovereignCount = 0,
  sovereignOnly,
  setSovereignOnly,
  visitedCount = 0,
  visitedOnly,
  setVisitedOnly,
  countryLists = [],
  selectedListId = null,
  setSelectedListId,
}: CountriesSearchSortBarProps) {
  const { timelineMode } = useTimeline();

  // Enable drag-to-scroll for the toggles container
  const togglesRef = useRef<HTMLDivElement>(null);
  useDragScroll(togglesRef);

  // Build toggle options
  const defaultOptions = [
    { value: "all", label: "All", count: allCount },
    { value: "sovereign", label: "Sovereign", count: sovereignCount },
    { value: "visited", label: "Visited", count: visitedCount },
  ];
  const customOptions = countryLists.map((list) => ({
    value: list.id,
    label: list.name,
    count: list.countryCodes.length,
  }));
  const options = [...defaultOptions, ...customOptions];

  // Determine selected toggle
  let selectedToggle = "all";
  if (visitedOnly) selectedToggle = "visited";
  else if (sovereignOnly) selectedToggle = "sovereign";
  else if (selectedListId) selectedToggle = selectedListId;

  return (
    <div className="items-center">
      <div className="flex items-stretch pb-0 mt-1">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search countries"
          className="flex-1 h-10"
        />
        <CountrySortSelect
          value={sortBy}
          onChange={(v: string) => setSortBy(v)}
          visitedOnly={visitedOnly}
        />
      </div>
      <div
        ref={togglesRef}
        className="mt-2 mb-2 flex items-center gap-2 overflow-x-auto whitespace-nowrap toggles-scroll"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <SegmentedToggle
          value={selectedToggle}
          options={options}
          onChange={(val) => {
            if (val === "visited") {
              setVisitedOnly?.(true);
              setSovereignOnly?.(false);
              setSelectedListId?.(null);
            } else if (val === "sovereign") {
              setVisitedOnly?.(false);
              setSovereignOnly?.(true);
              setSelectedListId?.(null);
            } else if (val === "all") {
              setVisitedOnly?.(false);
              setSovereignOnly?.(false);
              setSelectedListId?.(null);
            } else {
              // Custom list selected
              setVisitedOnly?.(false);
              setSovereignOnly?.(false);
              setSelectedListId?.(val);
            }
          }}
          disabled={timelineMode}
        />
        <ActionButton
          icon={<FaPlus />}
          ariaLabel="New list"
          title="New list"
          variant="secondary"
          onClick={() => {}}
          className="!rounded-full !px-2"
        />
      </div>
    </div>
  );
}
