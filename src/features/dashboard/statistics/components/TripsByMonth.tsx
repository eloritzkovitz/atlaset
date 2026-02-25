import { lazy, Suspense, useState } from "react";
import { FaCrown } from "react-icons/fa6";
import { DashboardCard, PieLegendCard, Table, Chip } from "@components";
import { MONTH_NAMES_SHORT, MONTH_COLORS } from "@constants/date";
import { MONTH_TABLE_COLUMNS } from "../constants/statistics";
import { useTripsByMonthStats } from "../hooks/useTripsByMonthStats";

const PieChart = lazy(() => import("@components/chart/PieChart"));

export function TripsByMonth() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const {
    tripsByMonthData,
    mostPopularMonth,
    leastPopularMonth,
    totalTripsForMonth,
  } = useTripsByMonthStats();

  // Ensure all months are represented, even with zero trips
  const allMonthsData = MONTH_NAMES_SHORT.map((name, idx) => {
    const found = tripsByMonthData.find(
      (m: { name: string }) => m.name === name,
    );
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
      <div className="flex flex-row gap-8 justify-center items-stretch">
        {/* Pie and legend */}
        <DashboardCard title="Trips by Month" className="flex-1 min-w-[400px]">
          {monthLabels.length > 0 ? (
            <div className="flex flex-row justify-center gap-50 min-h-[220px] mt-2">
              {/* Pie Chart */}
              <div className="flex flex-col items-center justify-center">
                <Suspense fallback={<div>Loading chart...</div>}>
                  <PieChart
                    labels={monthLabels}
                    data={monthCounts}
                    colors={monthColors}
                    hoveredIdx={hoveredIdx}
                    setHoveredIdx={setHoveredIdx}
                    size={350}
                  />
                </Suspense>
              </div>
              {/* Legend to the right */}
              <div className="flex flex-col gap-1 justify-center">
                {allMonthsData.map((d, idx) => (
                  <PieLegendCard
                    key={d.name}
                    label={d.name}
                    color={d.color}
                    percentage={d.percentage}
                    isActive={hoveredIdx === idx}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    direction="horizontal"
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted">No trip data available.</p>
          )}
        </DashboardCard>
        {/* Popularity cards */}
        <div className="flex flex-col gap-4 min-w-[320px] max-w-[380px]">
          <DashboardCard title="Most Popular Month">
            <div className="flex items-center gap-2">
              <Chip className="bg-surface font-semibold px-3 py-2 text-base gap-2">
                <FaCrown className="text-yellow-500 text-lg" />
                {mostPopularMonth?.name ?? "—"}
                {mostPopularMonth && (
                  <span className="text-muted font-normal text-sm ml-2">
                    ({mostPopularMonth.total} trips,{" "}
                    {totalTripsForMonth > 0
                      ? `${Math.round((mostPopularMonth.total / totalTripsForMonth) * 100)}%`
                      : "0%"}
                    )
                  </span>
                )}
              </Chip>
            </div>
          </DashboardCard>
          <DashboardCard title="Least Popular Month">
            <div className="flex items-center gap-2">
              <Chip className="bg-surface font-semibold px-3 py-2 text-base gap-2">
                {leastPopularMonth?.name ?? "—"}
                {leastPopularMonth && (
                  <span className="text-muted font-normal text-sm ml-2">
                    ({leastPopularMonth.total} trips,{" "}
                    {totalTripsForMonth > 0
                      ? `${Math.round((leastPopularMonth.total / totalTripsForMonth) * 100)}%`
                      : "0%"}
                    )
                  </span>
                )}
              </Chip>
            </div>
          </DashboardCard>
        </div>
      </div>
      <DashboardCard title="Monthly Trip Breakdown" className="mt-6">
        <div className="overflow-x-auto">
          <Table columns={MONTH_TABLE_COLUMNS} data={allMonthsData} />
        </div>
      </DashboardCard>
    </>
  );
}
