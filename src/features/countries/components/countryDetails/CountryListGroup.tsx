import React from "react";
import { useTranslation } from "react-i18next";
import { CollapsibleHeader, EmptyListMessage } from "@components";
import { CountryListRow } from "../countryDisplay/CountryListRow";
import { SPECIAL_COUNTRIES } from "../../constants/specialCountries";
import { type Country } from "../../types";
import { getCountryResourceBundle } from "../../utils/countryLocalization";

interface CountryListGroupProps {
  label: React.ReactNode;
  isoCodes: string[];
  countries: Country[];
  visited?: (iso: string) => boolean;
  expanded: boolean;
  onToggle: () => void;
  onSelectCountry?: (isoCode: string) => void;
}

export const CountryListGroup: React.FC<CountryListGroupProps> = ({
  label,
  isoCodes,
  countries,
  visited,
  expanded,
  onToggle,
  onSelectCountry,
}) => {
  const { i18n } = useTranslation();

  // Map isoCodes to country objects and sort by name
  const sortedCountries = isoCodes
    .map((iso) => {
      const found = countries.find((c) => c.isoCode === iso);
      if (found) return found;

      const special = SPECIAL_COUNTRIES[iso];
      if (special) {
        const bundle = getCountryResourceBundle(i18n.language, i18n);
        const trans = bundle[iso] ?? {};
        return {
          isoCode: iso,
          name: trans.name ?? special.name,
        } as Country;
      }
      return undefined;
    })
    .filter(Boolean)
    .sort((a, b) => a!.name.localeCompare(b!.name));

  return (
    <CollapsibleHeader
      label={label}
      count={sortedCountries.length}
      expanded={expanded}
      icon={undefined}
      onToggle={onToggle}
    >
      {sortedCountries.length === 0 ? (
        <EmptyListMessage message="No countries found." />
      ) : (
        <div className="flex flex-col text-lg">
          {sortedCountries.map((country) => {
            const isVisited = visited ? visited(country!.isoCode) : true;

            return (
              <CountryListRow
                key={country!.isoCode}
                country={country!}
                tone={isVisited ? "visited" : "dimmed-gray"}
                onClick={() =>
                  onSelectCountry && onSelectCountry(country!.isoCode)
                }
              />
            );
          })}
        </div>
      )}
    </CollapsibleHeader>
  );
};
