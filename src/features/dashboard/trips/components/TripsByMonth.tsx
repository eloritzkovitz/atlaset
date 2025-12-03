import { useState } from "react";
import { FaSuitcaseRolling, FaCrown } from "react-icons/fa6";
import { PieChart, PieLegendCard } from "@components";
import { MONTH_NAMES, MONTH_COLORS } from "../constants/date";
import { useTripsStats } from "../hooks/useTripsStats";
import { DashboardCard } from "../../components/DashboardCard";

export function TripsByMonth() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const { tripsByMonthData, mostPopularMonth, totalTripsForMonth } =
    useTripsStats();

  // Ensure all months are represented, even with zero trips
  const allMonthsData = MONTH_NAMES.map((name, idx) => {
    const found = tripsByMonthData.find((m) => m.name === name);
    return {
      name,
      count: found ? found.value : 0,
      color: MONTH_COLORS[idx % MONTH_COLORS.length],
    };
  });

  // Calculate percentages
  const total = totalTripsForMonth;
  const sortedData = allMonthsData.map((d) => ({
    ...d,
    percentage: total ? (d.count / total) * 100 : 0,
  }));

  const monthLabels = sortedData.map((d) => d.name);
  const monthCounts = sortedData.map((d) => d.count);
  const monthColors = sortedData.map((d) => d.color);

  return (
    <>
      <DashboardCard>
        <div className="w-full flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FaSuitcaseRolling className="text-blue-400" />
            Trips by Month
          </h2>
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
                    ({mostPopularMonth.value} trips,{" "}
                    {total > 0
                      ? `${Math.round((mostPopularMonth.value / total) * 100)}%`
                      : "0%"}
                    )
                  </span>
                )}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4">
                {sortedData.map((d, idx) => (
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
        </div>
      </DashboardCard>

      {/* Table/List of all months */}
      <DashboardCard className="w-full mt-6">
        <div className="font-semibold text-lg mb-2">Trips per Month</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-400">
                <th className="text-left py-1">Month</th>
                <th className="text-left py-1">Trips</th>
                <th className="text-left py-1">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((month) => (
                <tr key={month.name} className="border-t border-gray-800">
                  <td className="py-1 flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ background: month.color }}
                    />
                    {month.name}
                  </td>
                  <td className="py-1">{month.count}</td>
                  <td className="py-1">
                    {total > 0 ? `${month.percentage.toFixed(1)}%` : "0%"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </>
  );
}
