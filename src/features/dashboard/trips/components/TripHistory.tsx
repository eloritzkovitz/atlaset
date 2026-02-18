import { FaFlag, FaClockRotateLeft, FaCalendarDay } from "react-icons/fa6";
import { DashboardCard } from "@components";
import { CountryWithFlag } from "@features/countries";
import { useTripHistoryStats } from "../hooks/useTripHistoryStats";
import { TripList } from "./TripList";

export function TripHistory() {
  const { mostVisitedCountries, maxCount, firstTrip, lastTrip, recentTrips } =
    useTripHistoryStats();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Most visited country card */}
      <DashboardCard
        icon={FaFlag}
        iconClass="text-yellow-600"
        title="Most visited countries"
        subtitle="Based on completed abroad trips"
      >
        <div className="flex flex-wrap gap-2 items-center mt-2">
          {mostVisitedCountries.length > 0 ? (
            mostVisitedCountries.map((country, idx) => (
              <span
                key={country.isoCode}
                className="inline-flex items-center gap-1 bg-surface px-2 py-1 rounded-full"
              >
                <CountryWithFlag
                  isoCode={country.isoCode}
                  name={country.name}
                />
                <span className="text-xs text-muted">({maxCount} times)</span>
                {idx < mostVisitedCountries.length - 1}
              </span>
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
        title="Recent trips"
        subtitle="Your last 3 recorded trips"
      >
        <TripList trips={recentTrips} className="mt-4" />
      </DashboardCard>

      {/* First trip */}
      <DashboardCard
        icon={FaCalendarDay}
        iconClass="text-green-400"
        title="First trip"
        subtitle="Your earliest recorded trip"
      >
        <TripList trips={firstTrip ? [firstTrip] : []} className="mt-2" />
      </DashboardCard>

      {/* Last trip */}
      <DashboardCard
        icon={FaCalendarDay}
        iconClass="text-indigo-400"
        title="Last trip"
        subtitle="Your most recent trip"
      >
        <TripList trips={lastTrip ? [lastTrip] : []} className="mt-2" />
      </DashboardCard>
    </div>
  );
}
