import { useState } from "react";
import { FaThLarge, FaList } from "react-icons/fa";
import { ActionButton, SearchInput } from "@components";
import type { Country } from "@types";
import { CountryDisplay } from "./CountryDisplay";

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

  // Handler to toggle between grid and list views
  const handleToggle = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  // Filter countries by search
  const filteredCountries = (
    search
      ? countries.filter(
          (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.isoCode.toLowerCase().includes(search.toLowerCase())
        )
      : countries
  )
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

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
      <CountryDisplay
        countries={filteredCountries}
        visitedCountryCodes={visitedCountryCodes}
        view={viewMode}
      />
    </div>
  );
}
