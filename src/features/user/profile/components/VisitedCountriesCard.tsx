import { useTranslation } from "react-i18next";
import { Card, Tooltip } from "@components";
import { CountryFlag, useCountryData } from "@features/countries";

interface VisitedCountriesCardProps {
  visitedCountryCodes: string[];
}

export function VisitedCountriesCard({
  visitedCountryCodes,
}: VisitedCountriesCardProps) {
  const { countries } = useCountryData();
  const { t } = useTranslation("user");
  
  const visitedCountries = countries
    .filter((c) => visitedCountryCodes.includes(c.isoCode))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Card className="mt-6">
      <h2 className="text-xl font-bold mb-8">
        {t("profile.visitedCountries", { count: visitedCountries.length })}
      </h2>
      {visitedCountries.length === 0 ? (
        <div className="text-muted">{t("profile.noVisitedCountries")}</div>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-10 gap-6">
          {visitedCountries.map((c) => (
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
