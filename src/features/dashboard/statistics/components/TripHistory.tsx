import { useTranslation } from "react-i18next";
import { FaFlag, FaClockRotateLeft, FaCalendarDay } from "react-icons/fa6";
import { DashboardCard } from "@components";
import { CountryWithFlag } from "@features/countries";
import { Chip } from "@components";
import { useTripHistoryStats } from "../hooks/useTripHistoryStats";
import { TripList } from "./TripList";

export function TripHistory() {
  const { t } = useTranslation("dashboard");
  const { mostVisitedCountries, maxCount, firstTrip, lastTrip, recentTrips } =
    useTripHistoryStats();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Most visited country card */}
      <DashboardCard
        icon={FaFlag}
        iconClass="text-yellow-600"
        title={t("statistics.history.mostVisited.title", {
          defaultValue: "Most visited countries",
        })}
        subtitle={t("statistics.history.mostVisited.subtitle", {
          defaultValue: "Based on completed abroad trips",
        })}
      >
        <div className="flex flex-wrap gap-2 items-center mt-2">
          {mostVisitedCountries.length > 0 ? (
            mostVisitedCountries.map((country) => (
              <Chip
                key={country.isoCode}
                className="flex items-center gap-2 px-3 py-2 bg-surface"
              >
                <CountryWithFlag
                  isoCode={country.isoCode}
                  name={country.name}
                />
                <span className="text-xs text-muted">({maxCount} times)</span>
              </Chip>
            ))
          ) : (
            <span className="text-muted">—</span>
          )}
        </div>
      </DashboardCard>

      {/* Recent trips */}
      <DashboardCard
        icon={FaClockRotateLeft}
        iconClass="text-pink-400"
        title={t("statistics.history.recent.title", {
          defaultValue: "Recent trips",
        })}
        subtitle={t("statistics.history.recent.subtitle", {
          defaultValue: "Your last 3 recorded trips",
        })}
      >
        <TripList trips={recentTrips} className="mt-4" />
      </DashboardCard>

      {/* First trip */}
      <DashboardCard
        icon={FaCalendarDay}
        iconClass="text-green-400"
        title={t("statistics.history.first.title", {
          defaultValue: "First trip",
        })}
        subtitle={t("statistics.history.first.subtitle", {
          defaultValue: "Your earliest recorded trip",
        })}
      >
        <TripList trips={firstTrip ? [firstTrip] : []} className="mt-2" />
      </DashboardCard>

      {/* Last trip */}
      <DashboardCard
        icon={FaCalendarDay}
        iconClass="text-indigo-400"
        title={t("statistics.history.last.title", {
          defaultValue: "Last trip",
        })}
        subtitle={t("statistics.history.last.subtitle", {
          defaultValue: "Your most recent trip",
        })}
      >
        <TripList trips={lastTrip ? [lastTrip] : []} className="mt-2" />
      </DashboardCard>
    </div>
  );
}
