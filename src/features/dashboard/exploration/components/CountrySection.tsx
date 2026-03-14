import { useMemo, useState } from "react";
import { FaThLarge } from "react-icons/fa";
import {
  FaList,
  FaGlobe,
  FaCircleCheck,
  FaArrowRotateLeft,
} from "react-icons/fa6";
import { ActionButton, SearchInput, SelectInput } from "@components";
import {
  CountryDisplayPanel,
  CountrySortSelect,
  filterCountries,
  sortCountries,
  type Country,
} from "@features/countries";
import { coreFiltersConfig } from "@features/atlas/countries/config/filtersConfig";
import { useSort } from "@hooks";

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
    (f) => f.key === "subregion",
  )!;

  // Compute unique region and subregion arrays for options
  const uniqueRegions = Array.from(
    new Set(
      countries
        .map((c) => c.region)
        .filter((r): r is string => typeof r === "string" && !!r),
    ),
  );
  const uniqueSubregions =
    selectedRegion && selectedRegion !== "all"
      ? Array.from(
          new Set(
            countries
              .filter((c) => c.region === selectedRegion)
              .map((c) => c.subregion)
              .filter((s): s is string => typeof s === "string" && !!s),
          ),
        )
      : [];

  // Generate options using filter config functions
  const regionOptions = regionSelectFilter.getOptions(uniqueRegions);
  const subregionOptions = subregionSelectFilter.getOptions(uniqueSubregions);

  // Shared filter props for select filters
  const filterProps = {
    selectedRegion,
    setSelectedRegion,
    selectedSubregion,
    setSelectedSubregion,
    selectedSovereignty: "",
    setSelectedSovereignty: () => {},
    selectedVisited: "any",
    setSelectedVisited: () => {},
  };

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
    [countries, search, normalizedRegion, normalizedSubregion],
  );

  // Further filter by visited countries if toggled
  const filteredVisited = useMemo(
    () =>
      showVisitedOnly
        ? filtered.filter((c) => visitedCountryCodes.includes(c.isoCode))
        : filtered,
    [filtered, showVisitedOnly, visitedCountryCodes],
  );

  // Sort state
  const {
    sortBy,
    setSortBy,
    sortedItems: sortedCountries,
  } = useSort(
    filteredVisited,
    (items, sortBy) => sortCountries(items, sortBy, []),
    "name-asc",
  );

  return (
    <div className={className}>
      <div className="mb-4 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search countries"
              className="mt-1 rounded-md"
            />
            <div className="flex flex-row gap-2 w-full">
              <SelectInput
                value={regionSelectFilter.getValue(filterProps) ?? ""}
                onChange={(val) => {
                  if (val === "all") {
                    setSelectedRegion("all");
                    setSelectedSubregion("");
                    if (onAllCountries) onAllCountries();
                  } else {
                    regionSelectFilter.setValue(filterProps, val as string);
                    setSelectedSubregion("all");
                  }
                }}
                options={regionOptions}
                className="min-w-[110px]"
              />
              <SelectInput
                value={subregionSelectFilter.getValue(filterProps) ?? ""}
                onChange={(val) => {
                  if (val === "all" || val === "") {
                    setSelectedSubregion("");
                    if (onSubregionChange && selectedRegion) {
                      onSubregionChange(selectedRegion, "");
                    }
                  } else {
                    subregionSelectFilter.setValue(filterProps, val as string);
                    if (onSubregionChange && selectedRegion && val) {
                      onSubregionChange(selectedRegion, val as string);
                    }
                  }
                }}
                options={subregionOptions}
                disabled={!selectedRegion || selectedRegion === "all"}
                className="min-w-[240px]"
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 mt-2 sm:mt-0">
            <CountrySortSelect
              value={sortBy}
              onChange={(v: string) => setSortBy(v as typeof sortBy)}
              visitedOnly={undefined}
            />
            <div className="flex flex-row gap-2 ml-auto justify-end">
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
                title={
                  showVisitedOnly ? "Show All Countries" : "Show Visited Only"
                }
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
        </div>
      </div>
      <CountryDisplayPanel
        countries={sortedCountries}
        visitedCountryCodes={visitedCountryCodes}
        view={viewMode}
        showFlags={true}
        showBadges={false}
        selectedIsoCode={selectedIsoCode}
        onCountryInfo={(country) => setSelectedIsoCode(country.isoCode)}
      />
    </div>
  );
}
