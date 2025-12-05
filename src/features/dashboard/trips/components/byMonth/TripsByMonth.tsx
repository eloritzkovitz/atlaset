import { useState } from "react";
import { FaCrown } from "react-icons/fa6";
import { DashboardCard, PieChart, PieLegendCard, Table } from "@components";
import {
  MONTH_TABLE_COLUMNS,
  MONTH_NAMES,
  MONTH_COLORS,
} from "../../constants/month";
import { useTripsByMonthStats } from "../../hooks/useTripsByMonthStats";

export function TripsByMonth() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const { tripsByMonthData, mostPopularMonth, totalTripsForMonth } =
    useTripsByMonthStats();

  // Ensure all months are represented, even with zero trips
  const allMonthsData = MONTH_NAMES.map((name, idx) => {
    const found = tripsByMonthData.find((m) => m.name === name);
    const local = found ? found.local : 0;
    const abroad = found ? found.abroad : 0;
    const total = local + abroad;
    return {
      name,
      local,
      abroad,
      total,
      percentage:
        totalTripsForMonth > 0 ? (total / totalTripsForMonth) * 100 : 0,
      color: MONTH_COLORS[idx % MONTH_COLORS.length],
    };
  });

  const monthLabels = allMonthsData.map((d) => d.name);
  const monthCounts = allMonthsData.map((d) => d.total);
  const monthColors = allMonthsData.map((d) => d.color);

  return (
    <>
      <DashboardCard title="Trips by Month">
        {monthLabels.length > 0 ? (
          <>
            {/* Pie Chart */}
            <PieChart
              labels={monthLabels}
              data={monthCounts}
              colors={monthColors}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
            />

            {/* Most Popular Month */}
            <div className="my-4 flex items-center gap-2">
              <FaCrown className="text-yellow-400 text-xl" />
              <span className="font-semibold">
                Most Popular: {mostPopularMonth?.name ?? "—"}
              </span>
              {mostPopularMonth && (
                <span className="text-gray-400">
                  ({mostPopularMonth.total} trips,{" "}
                  {totalTripsForMonth > 0
                    ? `${Math.round(
                        (mostPopularMonth.total / totalTripsForMonth) * 100
                      )}%`
                    : "0%"}
                  )
                </span>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4">
              {allMonthsData.map((d, idx) => (
                <PieLegendCard
                  key={d.name}
                  label={d.name}
                  color={d.color}
                  percentage={d.percentage}
                  isActive={hoveredIdx === idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500">No trip data available.</p>
        )}
      </DashboardCard>
      <DashboardCard title="Monthly Trip Breakdown" className="mt-6">
        <div className="overflow-x-auto">
          <Table columns={MONTH_TABLE_COLUMNS} data={allMonthsData} />
        </div>
      </DashboardCard>
    </>
  );
}
