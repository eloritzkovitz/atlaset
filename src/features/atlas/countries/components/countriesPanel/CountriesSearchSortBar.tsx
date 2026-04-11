import { useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { ActionButton, SegmentedToggle } from "@components";
import { QualifierSearch } from "@components/form/inputs/QualifierSearch";
import { SUPPORTED_QUALIFIERS } from "@features/countries/constants/qualifierConfig";
import { useTimeline } from "@contexts/TimelineContext";
import { type CountryList } from "@features/countries";
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
  countryLists?: (CountryList & { count?: number })[];
  selectedListId?: string | null;
  setSelectedListId?: (id: string | null) => void;
  onAddList?: () => void;
  onEditList?: (id: string) => void;
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
  onAddList,
  onEditList,
}: CountriesSearchSortBarProps) {
  const { timelineMode } = useTimeline();

  // Enable drag-to-scroll for the toggles container
  const togglesRef = useRef<HTMLDivElement>(null);
  useDragScroll(togglesRef);

  // Build toggle options
  const options = [
    { value: "all", label: "All", count: allCount },
    { value: "sovereign", label: "Sovereign", count: sovereignCount },
    { value: "visited", label: "Visited", count: visitedCount },
    ...countryLists.map((list) => ({
      value: list.id,
      label: list.name,
      count: list.count ?? list.countryCodes.length,
    })),
  ];

  // Determine selected toggle
  const selectedToggle = visitedOnly
    ? "visited"
    : sovereignOnly
      ? "sovereign"
      : selectedListId || "all";

  // Qualifier should only be clearable when 'All' is selected; disable for sovereign, visited, and custom lists
  const qualifierClearable = selectedToggle === "all";

  // Handler for double-click editing
  const handleToggleDoubleClick = (val: string) => {
    if (typeof onEditList === "function") {
      onEditList(val);
    }
  };

  return (
    <div className="items-center">
      <div className="flex items-stretch pb-0 mt-1">
        <QualifierSearch
          value={search}
          onChange={setSearch}
          qualifiers={SUPPORTED_QUALIFIERS}
          clearable={qualifierClearable}
          lockedPrefix={
            selectedToggle === "visited"
              ? "visited"
              : selectedToggle === "sovereign"
                ? "sovereign"
                : undefined
          }
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
        {options.map((opt) => (
          <div
            key={opt.value}
            className="inline-block cursor-pointer"
            onDoubleClick={() => handleToggleDoubleClick(opt.value)}
          >
            <SegmentedToggle
              value={selectedToggle}
              options={[opt]}
              onChange={(val) => {
                const ensurePrefix = (prefix: string) => {
                  const current = String(search ?? "").trim();
                  const low = current.toLowerCase();
                  if (low.startsWith(prefix + ":")) return;
                  setSearch(`${prefix}: true`);
                };
                if (val === "visited") {
                  setVisitedOnly?.(true);
                  setSovereignOnly?.(false);
                  setSelectedListId?.(null);
                  ensurePrefix("visited");
                } else if (val === "sovereign") {
                  setVisitedOnly?.(false);
                  setSovereignOnly?.(true);
                  setSelectedListId?.(null);
                  ensurePrefix("sovereign");
                } else if (val === "all") {
                  setVisitedOnly?.(false);
                  setSovereignOnly?.(false);
                  setSelectedListId?.(null);
                  setSearch("");
                } else {
                  setVisitedOnly?.(false);
                  setSovereignOnly?.(false);
                  setSelectedListId?.(val);
                  setSearch("");
                }
              }}
              disabled={timelineMode}
            />
          </div>
        ))}
        <ActionButton
          icon={<FaPlus />}
          ariaLabel="New list"
          title="New list"
          variant="secondary"
          onClick={onAddList}
          className="!rounded-full !px-2"
        />
      </div>
    </div>
  );
}
