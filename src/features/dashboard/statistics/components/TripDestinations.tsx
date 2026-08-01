import { useTranslation } from "react-i18next";
import { FaFlag } from "react-icons/fa6";
import { Card, EmptyListMessage } from "@components";
import { CountryWithFlag } from "@features/countries";
import { useTripsStats } from "../hooks/useTripsStats";

export function TripDestinations() {
  const { t } = useTranslation("dashboard");

  const { visitedCountriesRanking } = useTripsStats();

  return (
    <div className="flex flex-col gap-6">
      <Card
        icon={FaFlag}
        iconClass="text-orange-500"
        title={t("statistics.visits.title", {
          defaultValue: "Most visited countries",
        })}
        subtitle={t("statistics.visits.subtitle", {
          defaultValue: "Ranked by visit count based on completed abroad trips",
        })}
      >
        <div className="mt-4 flex flex-col gap-2 overflow-y-auto">
          {visitedCountriesRanking.length > 0 ? (
            visitedCountriesRanking.map(({ country, visitCount }, idx) => (
              <div
                key={country.isoCode}
                className="bg-surface border-border flex items-center justify-between rounded-lg px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted w-4 text-xs font-semibold">
                    #{idx + 1}
                  </span>
                  <CountryWithFlag
                    isoCode={country.isoCode}
                    name={country.name}
                  />
                </div>
                <span className="text-muted text-xs font-medium">
                  {visitCount}
                </span>
              </div>
            ))
          ) : (
            <EmptyListMessage message={t("statistics.visits.empty")} />
          )}
        </div>
      </Card>
    </div>
  );
}
