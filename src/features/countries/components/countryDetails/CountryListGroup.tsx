import React from "react";
import { CollapsibleHeader, EmptyListMessage, MenuButton } from "@components";
import { CountryWithFlag } from "../countryFlag/CountryWithFlag";
import { SPECIAL_COUNTRIES } from "../../constants/countryRelations";
import { type Country } from "../../types";

interface CountryListGroupProps {
  label: string;
  isoCodes: string[];
  countries: Country[];
  expanded: boolean;
  onToggle: () => void;
  onSelectCountry?: (isoCode: string) => void;
}

export const CountryListGroup: React.FC<CountryListGroupProps> = ({
  label,
  isoCodes,
  countries,
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
          {sortedCountries.map((country) => (
            <MenuButton
              key={country!.isoCode}
              icon={undefined}
              onClick={() =>
                onSelectCountry && onSelectCountry(country!.isoCode)
              }
              className="py-2 px-2"
            >
              <CountryWithFlag
                isoCode={country!.isoCode}
                name={country!.name}
              />
            </MenuButton>
          ))}
        </div>
      )}
    </CollapsibleHeader>
  );
};
