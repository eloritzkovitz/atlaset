import { lazy, Suspense, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCrown } from "react-icons/fa6";
import { DashboardCard, PieLegendCard, Table, Chip } from "@components";
import { MONTH_NAMES_SHORT, MONTH_COLORS } from "@constants/date";
import { MONTH_TABLE_COLUMNS } from "../constants/statistics";
import { useTripsByMonthStats } from "../hooks/useTripsByMonthStats";
import { translateColumns } from "../utils/columns";

const PieChart = lazy(() => import("@components/chart/PieChart"));

export function TripsByMonth() {
  const { t } = useTranslation("dashboard");
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
        <DashboardCard
          title={t("statistics.months.title", {
            defaultValue: "Trips by Month",
          })}
          className="flex-1 min-w-[400px]"
        >
          {monthLabels.length > 0 ? (
            <div className="flex flex-row justify-center gap-50 min-h-[220px] mt-2">
              {/* Pie Chart */}
              <div className="flex flex-col items-center justify-center">
                <Suspense
                  fallback={
                    <div>
                      {t("statistics.loadingChart", {
                        defaultValue: "Loading chart...",
                      })}
                    </div>
                  }
                >
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
            <p className="text-muted">
              {t("statistics.months.noData", {
                defaultValue: "No trip data available.",
              })}
            </p>
          )}
        </DashboardCard>
        {/* Popularity cards */}
        <div className="flex flex-col gap-4 min-w-[320px] max-w-[380px]">
          <DashboardCard
            title={t("statistics.months.mostPopular.title", {
              defaultValue: "Most Popular Month",
            })}
          >
            <div className="flex items-center gap-2">
              <Chip className="bg-surface font-semibold px-3 py-2 text-base gap-2">
                <FaCrown className="text-yellow-500 text-lg" />
                {mostPopularMonth?.name ?? "—"}
                {mostPopularMonth && (
                  <span className="text-muted font-normal text-sm ms-2">
                    ({mostPopularMonth.total}{" "}
                    {t("statistics.months.trips", { defaultValue: "trips" })},{" "}
                    {totalTripsForMonth > 0
                      ? `${Math.round((mostPopularMonth.total / totalTripsForMonth) * 100)}%`
                      : "0%"}
                    )
                  </span>
                )}
              </Chip>
            </div>
          </DashboardCard>
          <DashboardCard
            title={t("statistics.months.leastPopular.title", {
              defaultValue: "Least Popular Month",
            })}
          >
            <div className="flex items-center gap-2">
              <Chip className="bg-surface font-semibold px-3 py-2 text-base gap-2">
                {leastPopularMonth?.name ?? "—"}
                {leastPopularMonth && (
                  <span className="text-muted font-normal text-sm ms-2">
                    ({leastPopularMonth.total}{" "}
                    {t("statistics.months.trips", { defaultValue: "trips" })},{" "}
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
      <DashboardCard
        title={t("statistics.months.breakdownTitle", {
          defaultValue: "Monthly Trip Breakdown",
        })}
        className="mt-6"
      >
        <div className="overflow-x-auto">
          <Table
            columns={useMemo(
              () => translateColumns(MONTH_TABLE_COLUMNS, t),
              [t],
            )}
            data={allMonthsData}
          />
        </div>
      </DashboardCard>
    </>
  );
}
