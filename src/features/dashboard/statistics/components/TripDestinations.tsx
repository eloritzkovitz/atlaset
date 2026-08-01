import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaFlag } from "react-icons/fa6";
import { Card, EmptyListMessage } from "@components";
import { CountryWithFlag } from "@features/countries";
import { useTripsStats } from "../hooks/useTripsStats";
import { getCountryRoute } from "../../navigation/utils/dashboardNavigation";

export function TripDestinations() {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();
  const { visitedCountriesRanking } = useTripsStats();

  // Handler for clicking on a country in the visited countries ranking
  const handleCountryClick = (
    country: (typeof visitedCountriesRanking)[number]["country"],
  ) => {
    const route = getCountryRoute(
      country.region,
      country.subregion,
      country.isoCode,
    );
    navigate(`${route}?tab=visits`);
  };

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
                onClick={() => handleCountryClick(country)}
                className="bg-surface border-border hover:bg-surface-hover flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition select-none"
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
