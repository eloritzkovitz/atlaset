import { useTranslation } from "react-i18next";
import { Card, EmptyListMessage } from "@components";
import { CountryFlagGrid } from "@features/countries";

export type TrackingListType = "visited" | "wantToVisit";

interface ProfileCountriesCardProps {
  countryCodes: string[];
  type: TrackingListType;
}

export function ProfileCountriesCard({
  countryCodes,
  type,
}: ProfileCountriesCardProps) {
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

  return (
    <Card className="mt-6">
      <h2 className="text-xl font-bold mb-8">
        {t(headingKey, { count: countryCodes.length })}
      </h2>

      {countryCodes.length === 0 ? (
        <EmptyListMessage message={t(emptyMessageKey)} />
      ) : (
        <CountryFlagGrid countryCodes={countryCodes} size="64" />
      )}
    </Card>
  );
}
