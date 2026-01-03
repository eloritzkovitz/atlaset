import { FaFlag, FaClockRotateLeft, FaCalendarDay } from "react-icons/fa6";
import { DashboardCard } from "@components";
import {
  CountryFlag,
  CountryWithFlag,
  useCountryData,
} from "@features/countries";
import { useTripHistoryStats } from "../hooks/useTripHistoryStats";

export function TripHistory() {
  const { countries } = useCountryData();

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
        <ul className="mt-4">
          {recentTrips && recentTrips.length > 0 ? (
            recentTrips.map((trip) => (
              <li key={trip.id} className="mt-4 mb-2 flex items-center gap-2">
                {/* Show up to 3 flags */}
                {trip.countryCodes.slice(0, 3).map((code) => {
                  const country = countries.find((c) => c.isoCode === code);
                  return country ? (
                    <CountryFlag
                      key={code}
                      flag={{
                        isoCode: country.isoCode,
                        ratio: "fourThree",
                        size: "32",
                      }}
                      alt={`${country.name} flag`}
                      className="h-6 w-auto"
                    />
                  ) : null;
                })}
                <span className="font-semibold">{trip.name}</span>
                <span className="text-xs text-muted">
                  {trip.startDate} {trip.endDate && `– ${trip.endDate}`}
                </span>
              </li>
            ))
          ) : (
            <li className="text-muted">—</li>
          )}
        </ul>
      </DashboardCard>

      {/* First trip */}
      <DashboardCard
        icon={FaCalendarDay}
        iconClass="text-green-400"
        title="First trip"
        subtitle="Your earliest recorded trip"
      >
        {firstTrip ? (
          <div className="text-lg font-bold text-green-400 mb-1">
            {firstTrip.name}
          </div>
        ) : (
          <div className="text-muted">—</div>
        )}
        <div className="text-muted text-sm">
          {firstTrip?.startDate}{" "}
          {firstTrip?.endDate && `- ${firstTrip.endDate}`}
        </div>
      </DashboardCard>

      {/* Last trip */}
      <DashboardCard
        icon={FaCalendarDay}
        iconClass="text-indigo-400"
        title="Last trip"
        subtitle="Your most recent trip"
      >
        {lastTrip ? (
          <div className="text-lg font-bold text-indigo-400 mb-1">
            {lastTrip.name}
          </div>
        ) : (
          <div className="text-muted">—</div>
        )}
        <div className="text-muted text-sm">
          {lastTrip?.startDate} {lastTrip?.endDate && `- ${lastTrip.endDate}`}
        </div>
      </DashboardCard>
    </div>
  );
}
