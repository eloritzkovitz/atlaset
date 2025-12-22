import { useMemo, useState } from "react";
import { FaThLarge } from "react-icons/fa";
import {
  FaList,
  FaGlobe,
  FaCircleCheck,
  FaArrowRotateLeft,
} from "react-icons/fa6";
import { ActionButton, SearchInput, SelectInput } from "@components";
import { filterCountries } from "@features/countries/utils/countryFilters";
import { coreFiltersConfig } from "@features/atlas/countries/config/filtersConfig";
import {
  CountryDisplayPanel,
  sortCountries,
  type Country,
} from "@features/countries";
import { useInfiniteScroll } from "@hooks/useInfiniteScroll";
import { usePagination } from "@hooks/usePagination";

interface CountrySectionProps {
  countries: Country[];
  visitedCountryCodes: string[];
  selectedIsoCode: string | null;
  setSelectedIsoCode: (isoCode: string | null) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedSubregion: string;
  setSelectedSubregion: (subregion: string) => void;
  search: string;
  setSearch: (search: string) => void;
  initialView?: "grid" | "list";
  className?: string;
  onSubregionChange?: (region: string, subregion: string) => void;
  onAllCountries?: () => void;
  resetFilters?: () => void;
}

const PAGE_SIZE = 24;

export function CountrySection({
  countries,
  visitedCountryCodes,
  selectedIsoCode,
  setSelectedIsoCode,
  selectedRegion,
  setSelectedRegion,
  selectedSubregion,
  setSelectedSubregion,
  search,
  setSearch,
  initialView = "grid",
  className = "",
  onSubregionChange,
  onAllCountries,
  resetFilters,
}: CountrySectionProps) {
  // Normalize 'all' and '' to undefined for filtering
  const normalizedRegion =
    !selectedRegion || selectedRegion === "all" ? undefined : selectedRegion;
  const normalizedSubregion =
    !selectedSubregion || selectedSubregion === "all"
      ? undefined
      : selectedSubregion;
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialView);
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);

  // Generate options for region and subregion filters
  const regionSelectFilter = coreFiltersConfig.find((f) => f.key === "region")!;
  const subregionSelectFilter = coreFiltersConfig.find(
    (f) => f.key === "subregion"
  )!;

  // Compute unique region and subregion arrays for options
  const uniqueRegions = Array.from(
    new Set(
      countries
        .map((c) => c.region)
        .filter((r): r is string => typeof r === "string" && !!r)
    )
  );
  const uniqueSubregions =
    selectedRegion && selectedRegion !== "all"
      ? Array.from(
          new Set(
            countries
              .filter((c) => c.region === selectedRegion)
              .map((c) => c.subregion)
              .filter((s): s is string => typeof s === "string" && !!s)
          )
        )
      : [];

  // Generate options using filter config functions
  const regionOptions = regionSelectFilter.getOptions(uniqueRegions);
  const subregionOptions = subregionSelectFilter.getOptions(uniqueSubregions);

  // Handler to reset all filters and route to all countries
  function handleResetFilters() {
    if (resetFilters) resetFilters();
    if (onAllCountries) onAllCountries();
  }

  // Handler to toggle visited/all
  const handleVisitedToggle = () => {
    setShowVisitedOnly((prev) => !prev);
  };

  // Handler to toggle between grid and list views
  const handleToggle = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  // Filter countries based on search and visited toggle
  const filtered = useMemo(
    () =>
      filterCountries(countries, {
        search,
        selectedRegion: normalizedRegion,
        selectedSubregion: normalizedSubregion,
      }),
    [countries, search, normalizedRegion, normalizedSubregion]
  );

  // Further filter by visited countries if toggled
  const filteredVisited = useMemo(
    () =>
      showVisitedOnly
        ? filtered.filter((c) => visitedCountryCodes.includes(c.isoCode))
        : filtered,
    [filtered, showVisitedOnly, visitedCountryCodes]
  );

  // Sort countries by name ascending
  const sortedCountries = useMemo(
    () => sortCountries(filteredVisited, "name-asc", []),
    [filteredVisited]
  );

  // Paginate countries
  const {
    data: paginatedCountries,
    hasMore,
    loadMore,
  } = usePagination({
    items: sortedCountries,
    pageSize: PAGE_SIZE,
  });

  // Infinite scroll sentinel
  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search countries..."
            className="w-xs"
          />
          <SelectInput
            value={
              regionSelectFilter.getValue({
                selectedRegion,
                setSelectedRegion,
                selectedSubregion,
                setSelectedSubregion,
                selectedSovereignty: "",
                setSelectedSovereignty: () => {},
              }) ?? ""
            }
            onChange={(val) => {
              regionSelectFilter.setValue(
                {
                  selectedRegion,
                  setSelectedRegion,
                  selectedSubregion,
                  setSelectedSubregion,
                  selectedSovereignty: "",
                  setSelectedSovereignty: () => {},
                },
                val as string
              );
              setSelectedSubregion("all");
              if (onAllCountries && val === "all") {
                onAllCountries();
              }
            }}
            options={regionOptions}
            className="ml-5 min-w-[150px] mt-3"
          />
          <SelectInput
            value={
              subregionSelectFilter.getValue({
                selectedRegion,
                setSelectedRegion,
                selectedSubregion,
                setSelectedSubregion,
                selectedSovereignty: "",
                setSelectedSovereignty: () => {},
              }) ?? ""
            }
            onChange={(val) => {
              subregionSelectFilter.setValue(
                {
                  selectedRegion,
                  setSelectedRegion,
                  selectedSubregion,
                  setSelectedSubregion,
                  selectedSovereignty: "",
                  setSelectedSovereignty: () => {},
                },
                val as string
              );
              if (onSubregionChange && selectedRegion && val && val !== "all" && val !== "") {
                onSubregionChange(selectedRegion, val as string);
              }
            }}
            options={subregionOptions}
            disabled={!selectedRegion || selectedRegion === "all"}
            className="min-w-[250px] mt-3"
          />
        </div>
        <div className="flex items-center gap-2">
          <ActionButton
            onClick={handleResetFilters}
            ariaLabel="Reset Filters"
            title="Reset Filters"
            icon={<FaArrowRotateLeft />}
            variant="toggle"
            rounded
          />
          <ActionButton
            onClick={handleVisitedToggle}
            ariaLabel={
              showVisitedOnly ? "Show All Countries" : "Show Visited Only"
            }
            title={showVisitedOnly ? "Show All Countries" : "Show Visited Only"}
            icon={
              showVisitedOnly ? (
                <span className="flex items-center gap-1 font-semibold text-sm">
                  <FaGlobe />
                </span>
              ) : (
                <span className="flex items-center gap-1 font-semibold text-sm">
                  <FaCircleCheck />
                </span>
              )
            }
            variant="toggle"
            rounded
          />
          <ActionButton
            onClick={handleToggle}
            ariaLabel={
              viewMode === "grid"
                ? "Switch to List View"
                : "Switch to Grid View"
            }
            title={
              viewMode === "grid"
                ? "Switch to List View"
                : "Switch to Grid View"
            }
            icon={viewMode === "grid" ? <FaList /> : <FaThLarge />}
            variant="toggle"
            rounded
          />
        </div>
      </div>
      <CountryDisplayPanel
        countries={paginatedCountries}
        visitedCountryCodes={visitedCountryCodes}
        view={viewMode}
        showFlags={true}
        showBadges={false}
        selectedIsoCode={selectedIsoCode}
        onCountryInfo={(country) => setSelectedIsoCode(country.isoCode)}
      />
      {/* Infinite scroll sentinel */}
      {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
    </div>
  );
}
