import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, EmptyListMessage, Tooltip } from "@components";
import { CountryFlag, useCountryData } from "@features/countries";

export type TrackingListType = "visited" | "wantToVisit";

interface ProfileCountriesCardProps {
  countryCodes: string[];
  type: TrackingListType;
}

export function ProfileCountriesCard({
  countryCodes,
  type,
}: ProfileCountriesCardProps) {
  const { countries } = useCountryData();
  const { t } = useTranslation("user");

  // Determine i18n localization paths based on type
  const headingKey =
    type === "visited"
      ? "profile.visitedCountries"
      : "profile.wantToVisitCountries";
  const emptyMessageKey =
    type === "visited"
      ? "profile.noVisitedCountries"
      : "profile.noWantToVisitCountries";

  // Memoize filtration and alphabetical sorting calculations
  const filteredCountries = useMemo(() => {
    return countries
      .filter((c) => countryCodes.includes(c.isoCode))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countries, countryCodes]);

  return (
    <Card className="mt-6">
      <h2 className="text-xl font-bold mb-8">
        {t(headingKey, { count: filteredCountries.length })}
      </h2>

      {filteredCountries.length === 0 ? (
        <EmptyListMessage message={t(emptyMessageKey)} />
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-10 gap-6">
          {filteredCountries.map((c) => (
            <li key={c.isoCode} className="flex items-center justify-center">
              <Tooltip content={c.name} position="bottom">
                <CountryFlag
                  flag={{
                    isoCode: c.isoCode,
                    sovereignState: c.sovereignState,
                    ratio: "3x2",
                    size: "64",
                  }}
                />
              </Tooltip>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
