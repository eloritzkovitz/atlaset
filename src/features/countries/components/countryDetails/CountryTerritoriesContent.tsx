import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { capitalizeWords } from "@utils/string";
import { CountryListGroup } from "./CountryListGroup";
import {
  getCountryName,
  getCountryTerritoryRelations,
} from "../../utils/countryData";
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
  const { i18n, t: tCountries } = useTranslation("countries");

  const group =
    country && country.isoCode
      ? getCountryTerritoryRelations(country)
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
      const lng = (i18n.language || "en").split("-")[0];
      const bundle = i18n.getResourceBundle?.(lng, "countries") ?? {};

      return Object.entries(group.groups).map(([prop, info]) => {
        const raw =
          bundle?.[country.isoCode as string]?.territories?.[prop] ??
          tCountries(`territories.${prop}`, {
            defaultValue:
              info.label ?? capitalizeWords(prop.replace(/[_-]/g, " ")),
          });

        const label =
          typeof raw === "string"
            ? raw
            : (raw?.label ?? raw?.name ?? String(raw));

        return { key: prop, label, data: sortByName(info.codes || []) };
      });
    }

    return [];
  }, [group, countries, country.isoCode, i18n, tCountries]);

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
    <div className="flex-1 overflow-y-auto px-4">
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
