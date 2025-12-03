import {
  FaSuitcaseRolling,
  FaLocationDot,
  FaPlane,
  FaGlobe,
  FaFlag,
  FaClock,
  FaRegClock,
} from "react-icons/fa6";
import { CountryWithFlag } from "@features/countries";
import { useTripsStats } from "../hooks/useTripsStats";
import { DashboardCard } from "../../components/DashboardCard";

export function TripsStats() {
  const {
    totalTrips,
    localTrips,
    abroadTrips,
    countriesVisited,
    mostVisitedCountries,
    maxCount,
    longestTrip,
    shortestTrip,
  } = useTripsStats();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <DashboardCard>
        <div className="flex items-center gap-3 mb-2">
          <FaSuitcaseRolling className="text-blue-600" />
          <span className="font-semibold text-lg">Total trips</span>
        </div>
        <div className="text-3xl font-bold text-blue-600">{totalTrips}</div>
      </DashboardCard>
      <DashboardCard>
        <div className="flex items-center gap-3 mb-2">
          <FaLocationDot className="text-green-600" />
          <span className="font-semibold text-lg">Local trips</span>
        </div>
        <div className="text-3xl font-bold text-green-600">
          {localTrips.length}
        </div>
      </DashboardCard>
      <DashboardCard>
        <div className="flex items-center gap-3 mb-2">
          <FaPlane className="text-purple-600" />
          <span className="font-semibold text-lg">Abroad trips</span>
        </div>
        <div className="text-3xl font-bold text-purple-600">
          {abroadTrips.length}
        </div>
      </DashboardCard>
      <DashboardCard>
        <div className="flex items-center gap-3 mb-2">
          <FaGlobe className="text-cyan-600" />
          <span className="font-semibold text-lg">Countries visited</span>
        </div>
        <div className="text-3xl font-bold text-cyan-600">
          {countriesVisited}
        </div>
      </DashboardCard>
      <DashboardCard>
        <div className="flex items-center gap-3 mb-2">
          <FaFlag className="text-yellow-600" />
          <span className="font-semibold text-lg">Most visited country</span>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {mostVisitedCountries.length > 0 ? (
            mostVisitedCountries.map((country, idx) => (
              <span
                key={country.isoCode}
                className="inline-flex items-center gap-1"
              >
                <CountryWithFlag
                  isoCode={country.isoCode}
                  name={country.name}
                />
                <span className="text-sm text-gray-500">
                  ({maxCount} times)
                </span>
                {idx < mostVisitedCountries.length - 1 && <span>,</span>}
              </span>
            ))
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>
      </DashboardCard>
      <DashboardCard>
        <div className="flex items-center gap-3 mb-2">
          <FaClock className="text-indigo-600" />
          <span className="font-semibold text-lg">Longest trip</span>
        </div>
        <div className="text-2xl font-bold text-indigo-600">
          {longestTrip ? `${longestTrip} days` : "—"}
        </div>
      </DashboardCard>
      <DashboardCard>
        <div className="flex items-center gap-3 mb-2">
          <FaRegClock className="text-pink-600" />
          <span className="font-semibold text-lg">Shortest trip</span>
        </div>
        <div className="text-2xl font-bold text-pink-600">
          {shortestTrip !== Infinity && shortestTrip > 0
            ? `${shortestTrip} days`
            : "—"}
        </div>
      </DashboardCard>
    </div>
  );
}
