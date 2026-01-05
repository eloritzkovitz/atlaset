import { SearchInput, SegmentedToggle } from "@components";
import { CountrySortSelect } from "./CountrySortSelect";
import { useTimeline } from "@contexts/TimelineContext";

interface CountriesSearchSortBarProps {
  search: string;
  setSearch: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;  
  visitedOnly?: boolean;
  setVisitedOnly?: (value: boolean) => void;
  allCount?: number;
  visitedCount?: number;
}

export function CountriesSearchSortBar({
  search,
  setSearch,
  sortBy,
  setSortBy,  
  visitedOnly,
  setVisitedOnly,
  allCount = 0,
  visitedCount = 0,
}: CountriesSearchSortBarProps) {
  const { timelineMode } = useTimeline();
  
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
      {/* Segmented toggle for All/Visited */}
      {typeof visitedOnly === "boolean" && setVisitedOnly && (
        <div className="mt-2 mb-2">
          <SegmentedToggle
            value={visitedOnly ? "visited" : "all"}
            options={[
              { value: "all", label: `All (${allCount})` },
              { value: "visited", label: `Visited (${visitedCount})` },
            ]}
            onChange={(val) => setVisitedOnly(val === "visited")}
            disabled={timelineMode}
          />
        </div>
      )}      
    </div>
  );
}
