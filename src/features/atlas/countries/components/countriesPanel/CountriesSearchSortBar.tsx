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
}: CountriesSearchSortBarProps) {
  const { timelineMode } = useTimeline();

  const togglesRef = useRef<HTMLDivElement>(null);
  useDragScroll(togglesRef);

  return (
    <div>
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
        className="mt-2 mb-2 -mx-2.5 flex items-center gap-2 overflow-x-auto whitespace-nowrap toggles-scroll"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <SegmentedToggle
          value={visitedOnly ? "visited" : sovereignOnly ? "sovereign" : "all"}
          options={[
            { value: "all", label: "All", count: allCount },
            { value: "sovereign", label: "Sovereign", count: sovereignCount },
            { value: "visited", label: "Visited", count: visitedCount },
          ]}
          onChange={(val) => {
            if (val === "visited") {
              setVisitedOnly?.(true);
              setSovereignOnly?.(false);
            } else if (val === "sovereign") {
              setVisitedOnly?.(false);
              setSovereignOnly?.(true);
            } else {
              setVisitedOnly?.(false);
              setSovereignOnly?.(false);
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
          className="!rounded-full bg-primary/70 !px-2"
        />
      </div>
    </div>
  );
}
