import { useState } from "react";
import {
  FaSuitcaseRolling,
  FaLocationDot,
  FaPlane,
  FaFlag,
  FaClock,
  FaRegClock,
} from "react-icons/fa6";
import { CountryWithFlag } from "@features/countries";
import { useTripsStats } from "../hooks/useTripsStats";
import { DashboardCard } from "../../components/DashboardCard";
import { PieChart, PieLegendCard } from "@components";

export function TripsStats() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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
  const PIE_COLORS = ["#34d399", "#a78bfa"];
  const tripTypeData = [
    { name: "Local", value: localTrips.length, color: PIE_COLORS[0] },
    { name: "Abroad", value: abroadTrips.length, color: PIE_COLORS[1] },
  ];
  const total = totalTrips;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Trips Overview */}
      <DashboardCard>
        <div className="flex items-center gap-3 mb-4">
          <FaSuitcaseRolling className="text-blue-600 text-3xl" />
          <div>
            <div className="font-bold text-xl">Trip Overview</div>
            <div className="text-xs text-gray-400">
              Summary of all your recorded trips
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-5xl font-extrabold text-blue-500 mb-2">
            {totalTrips}
          </div>
          <div className="text-sm text-gray-400 mb-4">Total Trips</div>
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                <FaLocationDot className="text-green-400" />
                {localTrips.length}
              </span>
              <span className="text-xs text-gray-500 mt-1">Local</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                <FaPlane className="text-purple-400" />
                {abroadTrips.length}
              </span>
              <span className="text-xs text-gray-500 mt-1">Abroad</span>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Trip Type Breakdown Pie Chart */}
      <DashboardCard>
        <div className="flex items-center gap-2 mb-10">
          <span className="text-purple-400">
            <FaPlane className="text-xl" />
          </span>
          <span className="font-bold text-lg">Trip Type Breakdown</span>
        </div>
        <div className="flex flex-row items-center justify-center gap-36 min-h-[220px] mt-4">
          {/* Pie Chart */}
          <div className="flex items-center justify-center w-48 h-48">
            <PieChart
              labels={tripTypeData.map((d) => d.name)}
              data={tripTypeData.map((d) => d.value)}
              colors={tripTypeData.map((d) => d.color)}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
            />
          </div>
          {/* Vertical Legend */}
          <div className="flex flex-col gap-4">
            {tripTypeData.map((d, idx) => (
              <PieLegendCard
                key={d.name}
                label={d.name}
                color={d.color}
                percentage={total ? (d.value / total) * 100 : 0}
                isActive={hoveredIdx === idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ))}
          </div>
        </div>
      </DashboardCard>

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
