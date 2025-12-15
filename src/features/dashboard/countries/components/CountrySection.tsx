import { useState } from "react";
import { FaThLarge, FaList, FaGlobe, FaCheckCircle } from "react-icons/fa";
import { ActionButton, SearchInput } from "@components";
import { filterCountries } from "@features/countries/utils/countryFilters";
import { CountryDisplayPanel, sortCountries } from "@features/countries";
import type { Country } from "@types";
import { useInfiniteScroll } from "@hooks/useInfiniteScroll";
import { usePagination } from "@hooks/usePagination";

interface CountrySectionProps {
  countries: Country[];
  visitedCountryCodes: string[];
  selectedIsoCode: string | null;
  setSelectedIsoCode: (isoCode: string | null) => void;
  initialView?: "grid" | "list";
  className?: string;
}

const PAGE_SIZE = 20;

export function CountrySection({
  countries,
  visitedCountryCodes,
  selectedIsoCode,
  setSelectedIsoCode,
  initialView = "grid",
  className = "",
}: CountrySectionProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialView);
  const [search, setSearch] = useState("");
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);

  // Handler to toggle visited/all
  const handleVisitedToggle = () => {
    setShowVisitedOnly((prev) => !prev);
  };

  // Handler to toggle between grid and list views
  const handleToggle = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  // Filter countries based on search and visited toggle
  let filtered = filterCountries(countries, { search });
  if (showVisitedOnly) {
    filtered = filtered.filter((c) => visitedCountryCodes.includes(c.isoCode));
  }

  // Sort countries by name ascending
  const sortedCountries = sortCountries(filtered, "name-asc", []);

  // Paginate countries
  const {
    data: paginatedCountries,
    hasMore,
    loadMore,
  } = usePagination({
    items: sortedCountries,
    pageSize: PAGE_SIZE,
    mode: "local",
  });

  // Infinite scroll sentinel
  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4 gap-2">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search countries..."
          className="max-w-xs"
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
                <FaCheckCircle />
              </span>
            )
          }
          variant="toggle"
          rounded
        />
        <ActionButton
          onClick={handleToggle}
          ariaLabel={
            viewMode === "grid" ? "Switch to List View" : "Switch to Grid View"
          }
          title={
            viewMode === "grid" ? "Switch to List View" : "Switch to Grid View"
          }
          icon={viewMode === "grid" ? <FaList /> : <FaThLarge />}
          variant="toggle"
          rounded
        />
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
