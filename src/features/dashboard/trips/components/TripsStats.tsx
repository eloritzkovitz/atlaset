import { useState } from "react";
import {
  FaSuitcaseRolling,
  FaLocationDot,
  FaPlane,
  FaClock,
  FaRegClock,
  FaStar,
  FaClockRotateLeft,
  FaCalendarDays,
  FaCheck
} from "react-icons/fa6";
import { DashboardCard, PieChart, PieLegendCard } from "@components";
import { TRIP_TYPE_COLORS } from "../constants/trips";
import { useTripsStats } from "../hooks/useTripsStats";

export function TripsStats() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const {
    totalTrips,
    localTrips,
    abroadTrips,
    completedTrips,
    upcomingTrips,    
    longestTrip,
    shortestTrip,
    longestTripName,
    longestTripRange,
    shortestTripName,
    shortestTripRange,
    averageTripDuration,
    totalDaysTraveling,
  } = useTripsStats();

  // Pie chart data for trip types
  const tripTypeData = [
    { name: "Local", value: localTrips.length, color: TRIP_TYPE_COLORS[0] },
    { name: "Abroad", value: abroadTrips.length, color: TRIP_TYPE_COLORS[1] },
  ];
  const total = totalTrips;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Trips Overview */}
      <DashboardCard
        icon={FaSuitcaseRolling}
        iconClass="text-blue-600"
        title="Trip Overview"
        subtitle="Summary of all your recorded trips"
      >
        <div className="flex flex-col items-center">
          <div className="text-5xl font-extrabold text-blue-500 mb-2 mt-6">
            {totalTrips}
          </div>
          <div className="text-sm text-gray-400 mb-4">Total Trips</div>
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <span className="flex text-2xl items-center gap-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-full font-semibold">
                <FaLocationDot className="text-green-400" />
                {localTrips.length}
              </span>
              <span className="text-xs text-gray-500 mt-1">Local</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex text-2xl items-center gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-3 py-1 rounded-full font-semibold">
                <FaPlane className="text-purple-400" />
                {abroadTrips.length}
              </span>
              <span className="text-xs text-gray-500 mt-1">Abroad</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex text-2xl items-center gap-1 bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300 px-3 py-1 rounded-full font-semibold">
                <FaCheck className="text-cyan-400" />
                {completedTrips.length}
              </span>
              <span className="text-xs text-gray-500 mt-1">Completed</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex text-2xl items-center gap-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 px-3 py-1 rounded-full font-semibold">
                <FaCalendarDays className="text-yellow-400" />
                {upcomingTrips.length}
              </span>
              <span className="text-xs text-gray-500 mt-1">Upcoming</span>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Trip Type Breakdown Pie Chart */}
      <DashboardCard
        icon={FaPlane}
        iconClass="text-purple-400"
        title="Trip Type Breakdown"
      >
        <div className="flex flex-row items-center justify-center gap-40 min-h-[220px] mt-4">
          {/* Pie Chart */}
          <div className="flex items-center justify-center w-48 h-48 mt-10 mb-10">
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

      {/* Longest trip card */}
      <DashboardCard
        icon={FaClock}
        iconClass="text-indigo-600"
        title="Longest trip"
        subtitle="Your trip with the most days abroad"
      >
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
      <DashboardCard
        icon={FaRegClock}
        iconClass="text-pink-600"
        title="Shortest trip"
        subtitle="Your shortest abroad trip"
      >
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

      {/* Average trip duration */}
      <DashboardCard
        icon={FaStar}
        iconClass="text-yellow-400"
        title="Average trip duration"
        subtitle="Average days per trip"
      >
        <div className="text-4xl font-extrabold text-yellow-400 mb-1">
          {averageTripDuration ? `${averageTripDuration.toFixed(1)} days` : "—"}
        </div>
      </DashboardCard>

      {/* Total days spent traveling */}
      <DashboardCard
        icon={FaClockRotateLeft}
        iconClass="text-blue-400"
        title="Total days traveling"
        subtitle="Sum of all trip durations"
      >
        <div className="text-4xl font-extrabold text-blue-400 mb-1">
          {totalDaysTraveling ? `${totalDaysTraveling} days` : "—"}
        </div>
      </DashboardCard>
    </div>
  );
}
