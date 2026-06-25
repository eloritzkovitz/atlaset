import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, SegmentedToggle, QualifierSearch } from "@components";
import { ICONS } from "@constants/icons";
import { useTimeline } from "@contexts/TimelineContext";
import { CountrySortSelect, type CountryList } from "@features/countries";
import { SUPPORTED_MODIFIERS } from "@features/countries/constants/modifierConfig";
import { SUPPORTED_QUALIFIERS } from "@features/countries/constants/qualifierConfig";
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
  wantToVisitCount?: number;
  wantToVisitOnly?: boolean;
  setWantToVisitOnly?: (value: boolean) => void;
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
  wantToVisitCount = 0,
  wantToVisitOnly,
  setWantToVisitOnly,
  countryLists = [],
  selectedListId = null,
  setSelectedListId,
  onAddList,
  onEditList,
}: CountriesSearchSortBarProps) {
  const { timelineMode } = useTimeline();
  const { t } = useTranslation("atlas");

  // Drag scroll state
  const togglesRef = useRef<HTMLDivElement>(null);
  const { isOverflowing, dragClassName } = useDragScroll(togglesRef, [
    countryLists,
    allCount,
    sovereignCount,
    visitedCount,
    wantToVisitCount,
  ]);

  const options = [
    { value: "all", label: t("countries.lists.all"), count: allCount },
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

  // Determine selected toggle
  const selectedToggle = wantToVisitOnly
    ? "wantToVisit"
    : visitedOnly
      ? "visited"
      : sovereignOnly
        ? "sovereign"
        : selectedListId || "all";

  // Qualifier should only be clearable when 'All' is selected; disable for sovereign, visited, and custom lists
  const qualifierClearable = selectedToggle === "all";

  // Handler for double-click editing
  const handleToggleDoubleClick = (val: string) => {
    if (val === "all" || val === "sovereign") return;

    // If the toggle corresponds to "visited" or a custom list, trigger the edit callback
    if (typeof onEditList === "function") {
      if (val === "visited") {
        onEditList("VISITED_COUNTRIES");
      } else if (val === "wantToVisit") {
        onEditList("WANT_TO_VISIT");
      } else {
        onEditList(val);
      }
    }
  };

  return (
    <div className="items-center">
      <div className="flex items-stretch pb-0 mt-1">
        <QualifierSearch
          value={search}
          onChange={setSearch}
          qualifiers={SUPPORTED_QUALIFIERS}
          modifiers={SUPPORTED_MODIFIERS}
          clearable={qualifierClearable}
          lockedPrefix={
            !timelineMode
              ? selectedToggle === "visited"
                ? "visited"
                : selectedToggle === "sovereign"
                  ? "sovereign"
                  : undefined
              : undefined
          }
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
        className={`mt-2 mb-2 flex items-center gap-2 overflow-x-auto whitespace-nowrap toggles-scroll ${dragClassName}`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {options.map((opt) => (
          <SegmentedToggle
            key={opt.value}
            value={selectedToggle}
            options={[opt]}
            onDoubleClick={(val) => handleToggleDoubleClick(val)}
            className={isOverflowing ? "!cursor-inherit" : "!cursor-pointer"}
            onChange={(val) => {
              const ensurePrefix = (prefix: string) => {
                const current = String(search ?? "").trim();
                const low = current.toLowerCase();
                if (low.startsWith(prefix + ":")) return;
                setSearch(`${prefix}: true`);
              };
              if (val === "wantToVisit") {
                setWantToVisitOnly?.(true);
                setVisitedOnly?.(false);
                setSovereignOnly?.(false);
                setSelectedListId?.(null);
                setSearch("");
              } else if (val === "visited") {
                setVisitedOnly?.(true);
                setWantToVisitOnly?.(false);
                setSovereignOnly?.(false);
                setSelectedListId?.(null);
                ensurePrefix("visited");
              } else if (val === "sovereign") {
                setVisitedOnly?.(false);
                setWantToVisitOnly?.(false);
                setSovereignOnly?.(true);
                setSelectedListId?.(null);
                ensurePrefix("sovereign");
              } else if (val === "all") {
                setVisitedOnly?.(false);
                setWantToVisitOnly?.(false);
                setSovereignOnly?.(false);
                setSelectedListId?.(null);
                setSearch("");
              } else {
                setVisitedOnly?.(false);
                setWantToVisitOnly?.(false);
                setSovereignOnly?.(false);
                setSelectedListId?.(val);
                setSearch("");
              }
            }}
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
