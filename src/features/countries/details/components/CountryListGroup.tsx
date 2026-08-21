import React from "react";
import { useTranslation } from "react-i18next";
import { CollapsibleHeader, EmptyListMessage } from "@components";
import { CountryListRow } from "../../browse/components/CountryListRow";
import { SPECIAL_COUNTRIES } from "../../core/constants/specialCountries";
import { useCountryData } from "../../core/hooks/useCountryData";
import { getCountryResourceBundle } from "../../core/utils/countryLocalization";
import { type Country } from "../../types";

interface CountryListGroupProps {
  label: React.ReactNode;
  isoCodes: string[];
  visited?: (iso: string) => boolean;
  expanded: boolean;
  onToggle: () => void;
  onSelectCountry?: (isoCode: string) => void;
}

export const CountryListGroup: React.FC<CountryListGroupProps> = ({
  label,
  isoCodes,
  visited,
  expanded,
  onToggle,
  onSelectCountry,
}) => {
  const { countryByIsoCode } = useCountryData();
  const { i18n } = useTranslation();

  const sortedCountries = isoCodes
    .map((iso) => {
      const found = countryByIsoCode[iso];

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
    .filter((country): country is Country => Boolean(country))
    .sort((a, b) => a.name.localeCompare(b.name));

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
