import React from "react";
import { CollapsibleHeader, EmptyListMessage, MenuButton } from "@components";
import { CountryWithFlag } from "../countryFlag/CountryWithFlag";
import { SPECIAL_COUNTRIES } from "../../constants/specialCountries";
import { type Country } from "../../types";

interface CountryListGroupProps {
  label: string;
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
  // Map isoCodes to country objects and sort by name
  const sortedCountries = isoCodes
    .map((iso) => {
      const found = countries.find((c) => c.isoCode === iso);
      if (found) return found;

      // Check SPECIAL_COUNTRIES for any missing entries
      const special = SPECIAL_COUNTRIES[iso];
      if (special) {
        return {
          isoCode: iso,
          name: special.name,
        } as Country;
      }
      return undefined;
    })
    .filter(Boolean)
    .sort((a, b) => a!.name.localeCompare(b!.name));

  return (
    <CollapsibleHeader
      label={`${label} (${sortedCountries.length})`}
      expanded={expanded}
      icon={undefined}
      onToggle={onToggle}
    >
      {sortedCountries.length === 0 ? (
        <EmptyListMessage message="No countries found." />
      ) : (
        <div className="flex flex-col text-lg">
          {sortedCountries.map((country) => {
            // Determine visited status if visited function is provided
            let isVisited: boolean | undefined = undefined;
            if (visited) {
              isVisited = visited(country!.isoCode);
            }

            return (
              <MenuButton
                key={country!.isoCode}
                icon={undefined}
                onClick={() =>
                  onSelectCountry && onSelectCountry(country!.isoCode)
                }
                className="py-2 px-2"
              >
                <span
                  style={{ opacity: visited ? (isVisited ? 1 : 0.4) : 1 }}
                  className={
                    visited && !isVisited ? "flag-grayscale-hover" : ""
                  }
                >
                  <CountryWithFlag
                    isoCode={country!.isoCode}
                    name={country!.name}
                    visited={isVisited}
                  />
                </span>
              </MenuButton>
            );
          })}
        </div>
      )}
    </CollapsibleHeader>
  );
};
