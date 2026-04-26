import { useMemo, useState } from "react";
import { capitalizeWords } from "@utils/string";
import { CountryListGroup } from "./CountryListGroup";
import { getCountryName, getCountryTerritories } from "../../utils/countryData";
import type { Country } from "../../types";

interface CountryTerritoriesContentProps {
  country: Country;
  countries: Country[];
  onSelectCountry?: (isoCode: string) => void;
}

export function CountryTerritoriesContent({
  country,
  countries,
  onSelectCountry,
}: CountryTerritoriesContentProps) {
  const group =
    country && country.isoCode
      ? getCountryTerritories(country)
      : undefined;

  // Prepare sections from territories data
  const sections = useMemo(() => {
    const sortByName = (arr: string[]) =>
      arr.slice().sort((a, b) => {
        const nameA = getCountryName(a, countries) || "";
        const nameB = getCountryName(b, countries) || "";
        return nameA.localeCompare(nameB);
      });

    // If no group or empty territories, return empty sections
    if (!group) return [];

    // If this ISO is a sovereign with named groups
    if (group.groups && Object.keys(group.groups).length > 0) {
      return Object.entries(group.groups).map(([prop, info]) => ({
        key: prop,
        label: info.label ?? capitalizeWords(prop.replace(/[_-]/g, " ")),
        data: sortByName(info.codes || []),
      }));
    }

    return [];
  }, [group, countries]);

  // Expanded state for each section
  const [expanded, setExpanded] = useState(() =>
    sections.reduce(
      (acc, s) => {
        acc[s.key] = !!s.data?.length;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  // Toggle handler
  const handleToggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {sections.map(
        (section) =>
          section.data &&
          section.data.length > 0 && (
            <CountryListGroup
              key={section.key}
              label={section.label}
              isoCodes={section.data}
              countries={countries}
              expanded={expanded[section.key]}
              onToggle={() => handleToggle(section.key)}
              onSelectCountry={onSelectCountry}
            />
          ),
      )}
    </div>
  );
}
