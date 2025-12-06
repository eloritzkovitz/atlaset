import { useState } from "react";
import { FaThLarge, FaList, FaGlobe, FaCheckCircle } from "react-icons/fa";
import { ActionButton, SearchInput } from "@components";
import { filterCountries } from "@features/countries/utils/countryFilters";
import { CountryDisplayPanel, sortCountries } from "@features/countries";
import type { Country } from "@types";

interface CountrySectionProps {
  countries: Country[];
  visitedCountryCodes: string[];
  initialView?: "grid" | "list";
  className?: string;
}

export function CountrySection({
  countries,
  visitedCountryCodes,
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
              <span className="flex items-center gap-1 font-semibold text-sm px-2">
                <FaGlobe className="text-base" />
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold text-sm px-2">
                <FaCheckCircle className="text-base" />
              </span>
            )
          }
          className="h-10 w-10 flex items-center justify-center rounded-full text-2xl transition hover:bg-gray-700 dark:hover:bg-gray-600"
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
          className="h-10 w-10 flex items-center justify-center rounded-full text-2xl transition hover:bg-gray-700 dark:hover:bg-gray-600"
        />
      </div>
      <CountryDisplayPanel
        countries={sortedCountries}
        visitedCountryCodes={visitedCountryCodes}
        view={viewMode}
        showFlags={true}
        showBadges={false}
      />
    </div>
  );
}
