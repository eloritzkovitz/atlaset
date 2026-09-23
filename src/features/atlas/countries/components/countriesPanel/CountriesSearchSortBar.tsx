import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, SegmentedToggle, QualifierSearch } from "@components";
import { ICONS } from "@constants/icons";
import { useTimeline } from "@features/atlas/timeline";
import { CountrySortSelect } from "@features/countries";
import { SUPPORTED_MODIFIERS } from "@features/countries/browse/constants/modifierConfig";
import { SUPPORTED_QUALIFIERS } from "@features/countries/browse/constants/qualifierConfig";
import { useDragScroll } from "@hooks";
import type { SortValue } from "@types";
import { useCountryFilters } from "../../context/CountryFiltersContext";
import type { CountryList } from "../../types";

interface CountriesSearchSortBarProps {
  sortBy: SortValue<string>;
  setSortBy: (value: string) => void;
  countryLists?: (CountryList & { count?: number })[];
  selectedListId?: string | null;
  setSelectedListId?: (id: string | null) => void;
  onAddList?: () => void;
  onEditList?: (id: string) => void;
}

type ConditionToggle = "visited" | "wantToVisit" | "sovereign";

const CONDITIONS: Record<ConditionToggle, { prefix: string; search: string }> =
  {
    visited: {
      prefix: "visited",
      search: "visited:true",
    },
    wantToVisit: {
      prefix: "wanttovisit",
      search: "wanttovisit:true",
    },
    sovereign: {
      prefix: "sovereign",
      search: "sovereign:true",
    },
  };

const SPECIAL_LIST_IDS: Record<string, string> = {
  visited: "VISITED_COUNTRIES",
  wantToVisit: "WANT_TO_VISIT",
};

// Checks if the search string contains a condition prefix and returns the corresponding toggle if found.
function getSearchCondition(value: string): ConditionToggle | null {
  const normalized = value.trim().toLowerCase();

  for (const [toggle, { prefix }] of Object.entries(CONDITIONS) as [
    ConditionToggle,
    (typeof CONDITIONS)[ConditionToggle],
  ][]) {
    const pattern = new RegExp(`(?:^|\\s)${prefix}\\s*:\\s*true(?:\\s|$)`, "i");

    if (pattern.test(normalized)) {
      return toggle;
    }
  }

  return null;
}

export function CountriesSearchSortBar({
  sortBy,
  setSortBy,
  countryLists = [],
  selectedListId = null,
  setSelectedListId,
  onAddList,
  onEditList,
}: CountriesSearchSortBarProps) {
  const {
    allCount,
    sovereignCount,
    visitedCount,
    wantToVisitCount,
    visitedOnly,
    setVisitedOnly,
    wantToVisitOnly,
    setWantToVisitOnly,
    sovereignOnly,
    setSovereignOnly,
    search,
    setSearch,
  } = useCountryFilters();

  const { timelineMode } = useTimeline();
  const { t } = useTranslation("atlas");

  const togglesRef = useRef<HTMLDivElement>(null);

  const { isOverflowing, dragClassName } = useDragScroll(togglesRef, [
    countryLists,
    allCount,
    sovereignCount,
    visitedCount,
    wantToVisitCount,
  ]);

  const options = [
    {
      value: "all",
      label: t("countries.lists.all"),
      count: allCount,
    },
    {
      value: "sovereign",
      label: t("countries.lists.sovereign"),
      count: sovereignCount,
    },
    {
      value: "visited",
      label: t("countries.lists.visited"),
      count: visitedCount,
    },
    {
      value: "wantToVisit",
      label: t("countries.lists.wantToVisit"),
      count: wantToVisitCount,
    },
    ...countryLists.map((list) => ({
      value: list.id,
      label: list.name,
      count: list.count ?? list.countryCodes.length,
    })),
  ];

  const selectedToggle = wantToVisitOnly
    ? "wantToVisit"
    : visitedOnly
      ? "visited"
      : sovereignOnly
        ? "sovereign"
        : selectedListId || "all";

  const setCondition = useCallback(
    (condition: ConditionToggle | null) => {
      setVisitedOnly?.(condition === "visited");
      setWantToVisitOnly?.(condition === "wantToVisit");
      setSovereignOnly?.(condition === "sovereign");
      setSelectedListId?.(null);
    },
    [setVisitedOnly, setWantToVisitOnly, setSovereignOnly, setSelectedListId],
  );

  // Update condition based on search changes, but only if not in timeline mode
  useEffect(() => {
    if (timelineMode) {
      return;
    }

    const condition = getSearchCondition(search);

    setCondition(condition);
  }, [search, timelineMode, setCondition]);

  const handleToggleDoubleClick = (value: string) => {
    if (value === "all" || value === "sovereign") {
      return;
    }

    onEditList?.(SPECIAL_LIST_IDS[value] ?? value);
  };

  const handleToggleChange = (value: string) => {
    if (value in CONDITIONS) {
      const condition = value as ConditionToggle;

      setCondition(condition);
      setSearch(CONDITIONS[condition].search);
      return;
    }

    if (value === "all") {
      setCondition(null);
      setSearch("");
      return;
    }

    setCondition(null);
    setSelectedListId?.(value);
    setSearch("");
  };

  return (
    <div className="items-center">
      <div className="flex items-stretch pb-0 mt-1">
        <QualifierSearch
          value={search}
          onChange={setSearch}
          qualifiers={SUPPORTED_QUALIFIERS}
          modifiers={SUPPORTED_MODIFIERS}
          placeholder={t("countries.searchPlaceholder")}
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
        className={`flex mt-2 py-2 items-center gap-2 overflow-x-auto whitespace-nowrap toggles-scroll ${dragClassName}`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {options.map((opt) => (
          <SegmentedToggle
            key={opt.value}
            value={selectedToggle}
            options={[opt]}
            onDoubleClick={(val) => handleToggleDoubleClick(val)}
            className={isOverflowing ? "!cursor-inherit" : "!cursor-pointer"}
            onChange={handleToggleChange}
            disabled={timelineMode}
          />
        ))}

        <ActionButton
          icon={<ICONS.add />}
          ariaLabel={t("countries.actions.newList")}
          title={t("countries.actions.newList")}
          variant="secondary"
          onClick={() => onAddList?.()}
          className="!rounded-full !px-2 cursor-pointer"
        />
      </div>
    </div>
  );
}
