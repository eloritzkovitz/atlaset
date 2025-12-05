import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Card } from "@components";
import type { Country } from "@types";
import { percent } from "@utils/number";
import { SubregionCountryList } from "./SubregionCountryList";
import { regionIcons, defaultRegionIcon } from "../constants/regionIcons";
import type { SubregionStat } from "../../types";

interface RegionCardProps {
  region: string;
  visited: number;
  total: number;
  subregions: SubregionStat[];
  countries: Country[];
  visitedCountryCodes: string[];
}

export function RegionCard({
  region,
  visited,
  total,
  subregions,
  countries,
  visitedCountryCodes,
}: RegionCardProps) {
  const [selectedSubregion, setSelectedSubregion] = useState<string | null>(
    null
  );
  const [showAllRegionCountries, setShowAllRegionCountries] = useState(false);

  // Show all countries in the region
  if (showAllRegionCountries) {
    return (
      <Card>
        <div className="flex items-center mb-4">
          <button
            className="mr-2 text-gray-500 hover:text-blue-600"
            onClick={() => setShowAllRegionCountries(false)}
            title="Back to region"
          >
            <FaArrowLeft />
          </button>
          <span className="text-2xl font-semibold">
            {region} - All Countries
          </span>
        </div>
        <SubregionCountryList
          countries={countries}
          visitedCountryCodes={visitedCountryCodes}
        />
      </Card>
    );
  }

  // Show countries in a subregion
  if (selectedSubregion) {
    const subCountries = countries.filter(
      (c) => c.subregion === selectedSubregion
    );
    return (
      <Card>
        <div className="flex items-center mb-4">
          <button
            className="mr-2 text-gray-500 hover:text-blue-600"
            onClick={() => setSelectedSubregion(null)}
            title="Back to region"
          >
            <FaArrowLeft />
          </button>
          <span className="text-2xl font-semibold">{selectedSubregion}</span>
        </div>
        <SubregionCountryList
          countries={subCountries}
          visitedCountryCodes={visitedCountryCodes}
        />
      </Card>
    );
  }

  // Default: show subregion stats and clickable region header
  return (
    <Card>
      <button
        className="flex items-center mb-2 text-2xl w-full rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition cursor-pointer focus:outline-none"
        onClick={() => setShowAllRegionCountries(true)}
        title={`Show all countries in ${region}`}
        aria-label={`Show all countries in ${region}`}
      >
        {regionIcons[region] || defaultRegionIcon}
        <span className="text-2xl text-blue-5600 font-semibold">{region}</span>
        <span className="ml-auto text-xl text-blue-500 font-bold">
          {visited}/{total} ({percent(visited, total)})
        </span>
      </button>
      <div className="ml-2">
        {subregions.map((sub) => (
          <button
            key={sub.name}
            className="flex items-center w-full text-base py-1 px-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition"
            onClick={() => setSelectedSubregion(sub.name)}
            title={`Show countries in ${sub.name}`}
          >
            <span className="text-gray-700 dark:text-gray-300">{sub.name}</span>
            <span className="ml-auto text-gray-500 dark:text-gray-400">
              {sub.visited}/{sub.total} ({percent(sub.visited, sub.total)})
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
