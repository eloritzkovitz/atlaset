import { FaFlag } from "react-icons/fa6";
import { useCountryData } from "@contexts/CountryDataContext";
import { CountryFlag, CountryWithFlag } from "@features/countries";
import { useTripHistoryStats } from "../../hooks/useTripHistoryStats";
import { DashboardCard } from "../../../components/DashboardCard";
import { FaCalendarAlt, FaHistory } from "react-icons/fa";

export function TripHistory() {
  const { countries } = useCountryData();

  const { mostVisitedCountries, maxCount, firstTrip, lastTrip, recentTrips } =
    useTripHistoryStats();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Most visited country card */}
      <DashboardCard>
        <div className="flex items-center gap-3 mb-2">
          <FaFlag className="text-yellow-600 text-2xl" />
          <div>
            <div className="font-semibold text-lg">Most visited countries</div>
            <div className="text-xs text-gray-400">
              Based on completed abroad trips
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center mt-2">
          {mostVisitedCountries.length > 0 ? (
            mostVisitedCountries.map((country, idx) => (
              <span
                key={country.isoCode}
                className="inline-flex items-center gap-1 bg-gray-700 px-2 py-1 rounded-full"
              >
                <CountryWithFlag
                  isoCode={country.isoCode}
                  name={country.name}
                />
                <span className="text-xs text-gray-400">
                  ({maxCount} times)
                </span>
                {idx < mostVisitedCountries.length - 1}
              </span>
            ))
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>
      </DashboardCard>

      {/* Recent trips */}
      <DashboardCard>
        <div className="flex items-center gap-3 mb-2">
          <FaHistory className="text-pink-400 text-2xl" />
          <div>
            <div className="font-semibold text-lg">Recent trips</div>
            <div className="text-xs text-gray-400">
              Your last 3 recorded trips
            </div>
          </div>
        </div>
        <ul className="mt-2">
          {recentTrips && recentTrips.length > 0 ? (
            recentTrips.map((trip) => (
              <li key={trip.id} className="mb-2 flex items-center gap-2">
                {/* Show up to 3 flags */}
                {trip.countryCodes.slice(0, 3).map((code) => {
                  const country = countries.find((c) => c.isoCode === code);
                  return country ? (
                    <CountryFlag
                      key={code}
                      flag={{
                        isoCode: country.isoCode,
                        source: "flagcdn",
                        style: "flat",
                        size: "32",
                      }}
                      alt={`${country.name} flag`}
                      className="h-6 w-auto"
                    />
                  ) : null;
                })}
                <span className="font-semibold">{trip.name}</span>
                <span className="text-xs text-gray-400">
                  {trip.startDate} {trip.endDate && `– ${trip.endDate}`}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-400">—</li>
          )}
        </ul>
      </DashboardCard>

      {/* First trip */}
      <DashboardCard>
        <div className="flex items-center gap-3 mb-2">
          <FaCalendarAlt className="text-green-400 text-2xl" />
          <div>
            <div className="font-semibold text-lg">First trip</div>
            <div className="text-xs text-gray-400">
              Your earliest recorded trip
            </div>
          </div>
        </div>
        {firstTrip ? (
          <div className="text-lg font-bold text-green-400 mb-1">
            {firstTrip.name}
          </div>
        ) : (
          <div className="text-gray-400">—</div>
        )}
        <div className="text-sm text-gray-400">
          {firstTrip?.startDate}{" "}
          {firstTrip?.endDate && `– ${firstTrip.endDate}`}
        </div>
      </DashboardCard>

      {/* Last trip */}
      <DashboardCard>
        <div className="flex items-center gap-3 mb-2">
          <FaCalendarAlt className="text-indigo-400 text-2xl" />
          <div>
            <div className="font-semibold text-lg">Last trip</div>
            <div className="text-xs text-gray-400">Your most recent trip</div>
          </div>
        </div>
        {lastTrip ? (
          <div className="text-lg font-bold text-indigo-400 mb-1">
            {lastTrip.name}
          </div>
        ) : (
          <div className="text-gray-400">—</div>
        )}
        <div className="text-sm text-gray-400">
          {lastTrip?.startDate} {lastTrip?.endDate && `– ${lastTrip.endDate}`}
        </div>
      </DashboardCard>
    </div>
  );
}
