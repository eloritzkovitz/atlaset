import { lazy, Suspense, useState } from "react";
import {
  FaChartPie,
  FaClock,
  FaClockRotateLeft,
  FaRegClock,
  FaStar,
  FaSuitcaseRolling,
} from "react-icons/fa6";
import { DashboardCard, PieLegendCard, SegmentedToggle } from "@components";
import { TripList } from "./TripList";
import { TripTypeChip } from "./TripTypeChip";
import {
  TRIP_TYPE_COLORS,
  TRIP_TYPE_LABELS,
  TRIP_TYPE_ICONS,
  TRIP_TYPE_COLOR_CLASSES,
  TRIP_STATUS_COLORS,
  TRIP_STATUS_LABELS,
  TRIP_STATUS_ICONS,
  TRIP_STATUS_COLOR_CLASSES,
} from "../constants/trips";
import { useTripsStats } from "../hooks/useTripsStats";

const PieChart = lazy(() => import("@components/chart/PieChart"));

export function TripsStats() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [pieMode, setPieMode] = useState<"type" | "status">("type");

  const {
    totalTrips,
    localTrips,
    abroadTrips,
    completedTrips,
    upcomingTrips,
    plannedTrips,
    longestTrip,
    shortestTrip,
    averageTripDuration,
    totalDaysTraveling,
  } = useTripsStats();

  // Pie chart data for trip types and statuses
  const tripTypeCounts = [localTrips.length, abroadTrips.length];
  const tripTypeData = TRIP_TYPE_LABELS.map((label, i) => ({
    name: label,
    value: tripTypeCounts[i],
    color: TRIP_TYPE_COLORS[i],
    icon: TRIP_TYPE_ICONS[i],
    colorClass: TRIP_TYPE_COLOR_CLASSES[i],
  }));

  const tripStatusCounts = [
    plannedTrips.length,
    upcomingTrips.length,
    completedTrips.length,
  ];
  const tripStatusData = TRIP_STATUS_LABELS.map((label, i) => ({
    name: label,
    value: tripStatusCounts[i],
    color: TRIP_STATUS_COLORS[i],
    icon: TRIP_STATUS_ICONS[i],
    colorClass: TRIP_STATUS_COLOR_CLASSES[i],
  }));

  const pieData = pieMode === "type" ? tripTypeData : tripStatusData;
  const total = pieData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Trips Overview */}
      <DashboardCard
        icon={FaSuitcaseRolling}
        iconClass="text-blue-500"
        title="Trip Overview"
        subtitle="Summary of all your recorded trips"
      >
        <div className="flex flex-col items-center">
          <div className="text-5xl font-extrabold text-blue-500 mb-2 mt-6">
            {totalTrips}
          </div>
          <div className="text-muted text-sm mb-4">Total Trips</div>
          <div className="flex gap-6 mb-6">
            {tripStatusData.map((d) => (
              <TripTypeChip
                key={d.name}
                icon={d.icon}
                value={d.value}
                label={d.name}
                colorClass={d.colorClass}
              />
            ))}
          </div>
          <div className="flex gap-6">
            {tripTypeData.map((d) => (
              <TripTypeChip
                key={d.name}
                icon={d.icon}
                value={d.value}
                label={d.name}
                colorClass={d.colorClass}
              />
            ))}
          </div>
        </div>
      </DashboardCard>

      {/* Trip Breakdown Pie Chart */}
      <DashboardCard
        icon={FaChartPie}
        iconClass={"text-purple-400"}
        title={"Trip Breakdown"}
        subtitle={
          pieMode === "type"
            ? "Distribution of trips (local and abroad)"
            : "Distribution of trip statuses"
        }
      >
        <div className="flex flex-col items-center">
          <SegmentedToggle
            value={pieMode}
            onChange={setPieMode}
            options={[
              { value: "type", label: "Type" },
              { value: "status", label: "Status" },
            ]}
            className="mt-4 mb-4"
          />
          <div className="flex flex-row items-center justify-center gap-40 min-h-[220px] mt-2">
            {/* Pie Chart */}
            <div className="flex items-center justify-center w-48 h-48 mt-10 mb-10">
              <Suspense fallback={<div>Loading chart...</div>}>
                <PieChart
                  labels={pieData.map((d) => d.name)}
                  data={pieData.map((d) => d.value)}
                  colors={pieData.map((d) => d.color)}
                  hoveredIdx={hoveredIdx}
                  setHoveredIdx={setHoveredIdx}
                />
              </Suspense>
            </div>
            {/* Vertical Legend */}
            <div className="flex flex-col gap-4">
              {pieData.map((d, idx) => (
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
        </div>
      </DashboardCard>

      {/* Longest trip card */}
      <DashboardCard
        icon={FaClock}
        iconClass="text-indigo-600"
        title="Longest trip"
        subtitle="Your trip with the most days abroad"
      >
        {longestTrip ? (
          <TripList trips={[longestTrip]} className="mt-2" showDuration />
        ) : (
          <div className="text-4xl font-extrabold text-indigo-400 mb-1">—</div>
        )}
      </DashboardCard>

      {/* Shortest trip card */}
      <DashboardCard
        icon={FaRegClock}
        iconClass="text-pink-600"
        title="Shortest trip"
        subtitle="Your shortest abroad trip"
      >
        {shortestTrip ? (
          <TripList trips={[shortestTrip]} className="mt-2" showDuration />
        ) : (
          <div className="text-4xl font-extrabold text-pink-400 mb-1">—</div>
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
        iconClass="text-sky-400"
        title="Total days traveling"
        subtitle="Sum of all trip durations"
      >
        <div className="text-4xl font-extrabold text-sky-400 mb-1">
          {totalDaysTraveling ? `${totalDaysTraveling} days` : "—"}
        </div>
      </DashboardCard>
    </div>
  );
}
