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

  // Compute region and subregion options from filtered countries
  const allRegions = Array.from(
    new Set(countries.map((c) => c.region).filter(Boolean))
  );
  const subregionOptions = selectedRegion
    ? Array.from(
        new Set(
          countries
            .filter((c) => c.region === selectedRegion)
            .map((c) => c.subregion)
            .filter(Boolean)
        )
      )
    : [];

  function resetFilters() {
    setSelectedRegion("");
    setSelectedSubregion("");
    setSearch("");
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
            label=""
            value={selectedRegion}
            onChange={(val) => {
              setSelectedRegion(val as string);
              setSelectedSubregion("");
            }}
            options={allRegions.map((r) => ({
              label: r ? r : "All Regions",
              value: r ? r : "",
            }))}
          />
          <SelectInput
            label=""
            value={selectedSubregion}
            onChange={(val) => setSelectedSubregion(val as string)}
            options={subregionOptions.map((s) => ({
              label: s ? s : "All Subregions",
              value: s ? s : "",
            }))}
          />
        </div>
        <div className="flex items-center gap-2">
          <ActionButton
            onClick={resetFilters}
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
