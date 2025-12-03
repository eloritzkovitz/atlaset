import {
  FaSuitcaseRolling,
  FaLocationDot,
  FaPlane,
  FaFlag,
  FaClock,
  FaRegClock,
} from "react-icons/fa6";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { CountryWithFlag } from "@features/countries";
import { useTripsStats } from "../hooks/useTripsStats";
import { DashboardCard } from "../../components/DashboardCard";

export function TripsStats() {
  const {
    totalTrips,
    localTrips,
    abroadTrips,
    mostVisitedCountries,
    maxCount,
    longestTrip,
    shortestTrip,
    longestTripName,
    longestTripRange,
    shortestTripName,
    shortestTripRange,
  } = useTripsStats();

  // Pie chart data for trip types
  const tripTypeData = [
    { name: "Local", value: localTrips.length },
    { name: "Abroad", value: abroadTrips.length },
  ];
  const PIE_COLORS = ["#34d399", "#a78bfa"];  

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Trips Overview */}
      <DashboardCard>
        <div className="flex items-center gap-3 mb-2">
          <FaSuitcaseRolling className="text-blue-600 text-2xl" />
          <div>
            <div className="font-semibold text-lg">Trips overview</div>
            <div className="text-xs text-gray-400">
              Local, abroad, and total trips
            </div>
          </div>
        </div>
        <div className="flex gap-6 mt-2">
          <div className="flex flex-col items-center">
            <FaLocationDot className="text-green-400 text-lg mb-1" />
            <span className="text-lg font-bold text-green-400">
              {localTrips.length}
            </span>
            <span className="text-xs text-gray-400">Local</span>
          </div>
          <div className="flex flex-col items-center">
            <FaPlane className="text-purple-400 text-lg mb-1" />
            <span className="text-lg font-bold text-purple-400">
              {abroadTrips.length}
            </span>
            <span className="text-xs text-gray-400">Abroad</span>
          </div>
          <div className="flex flex-col items-center">
            <FaSuitcaseRolling className="text-blue-400 text-lg mb-1" />
            <span className="text-lg font-bold text-blue-400">
              {totalTrips}
            </span>
            <span className="text-xs text-gray-400">Total</span>
          </div>
        </div>
      </DashboardCard>

      {/* Trip Type Breakdown Pie Chart */}
      <DashboardCard>
        <div className="font-semibold text-lg mb-2 flex items-center gap-2">
          <FaPlane className="text-purple-400" />
          Trip Type Breakdown
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={tripTypeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label={({ name, percent }) =>
                `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
              }
            >
              {tripTypeData.map((_entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={PIE_COLORS[idx % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </DashboardCard>

      {/* Most visited country card */}
      <DashboardCard>
        <div className="flex items-center gap-3 mb-2">
          <FaFlag className="text-yellow-600 text-2xl" />
          <div>
            <div className="font-semibold text-lg">Most visited country</div>
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
                className="inline-flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-full"
              >
                <CountryWithFlag
                  isoCode={country.isoCode}
                  name={country.name}
                />
                <span className="text-sm text-gray-300 font-medium">
                  {country.name}
                </span>
                <span className="text-xs text-gray-400">
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

      {/* Longest trip card */}
      <DashboardCard>
        <div className="flex items-center gap-3 mb-2">
          <FaClock className="text-indigo-600 text-2xl" />
          <div>
            <div className="font-semibold text-lg">Longest trip</div>
            <div className="text-xs text-gray-400">
              Your trip with the most days abroad
            </div>
          </div>
        </div>
        <div className="text-4xl font-extrabold text-indigo-400 mb-1">
          {longestTrip ? `${longestTrip} days` : "—"}
        </div>
        {longestTripName && (
          <div className="text-sm text-gray-400">
            <span className="font-semibold">{longestTripName}</span>
            {longestTripRange && <span> &middot; {longestTripRange}</span>}
          </div>
        )}
      </DashboardCard>

      {/* Shortest trip card */}
      <DashboardCard>
        <div className="flex items-center gap-3 mb-2">
          <FaRegClock className="text-pink-600 text-2xl" />
          <div>
            <div className="font-semibold text-lg">Shortest trip</div>
            <div className="text-xs text-gray-400">
              Your shortest abroad trip
            </div>
          </div>
        </div>
        <div className="text-4xl font-extrabold text-pink-400 mb-1">
          {shortestTrip !== Infinity && shortestTrip > 0
            ? `${shortestTrip} days`
            : "—"}
        </div>
        {shortestTripName && (
          <div className="text-sm text-gray-400">
            <span className="font-semibold">{shortestTripName}</span>
            {shortestTripRange && <span> &middot; {shortestTripRange}</span>}
          </div>
        )}
      </DashboardCard>      
    </div>
  );
}
