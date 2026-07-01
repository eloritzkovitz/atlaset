import { lazy, Suspense, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCrown } from "react-icons/fa6";
import { PieLegendCard, Table, Chip, Card } from "@components";
import { getMonthsShort, getMonthsLong } from "@utils/date";
import { MONTH_TABLE_COLUMNS } from "../constants/statistics";
import { useTripsByMonthStats } from "../hooks/useTripsByMonthStats";
import { translateColumns } from "../utils/columns";

const PieChart = lazy(() => import("@components/display/PieChart/PieChart"));

const MONTH_COLORS = [
  "#22d3ee",
  "#6366f1",
  "#818cf8",
  "#a78bfa",
  "#f472b6",
  "#f43f5e",
  "#f87171",
  "#f59e42",
  "#fbbf24",
  "#4ade80",
  "#34d399",
  "#10b981",
];

export function TripsByMonth() {
  const { t } = useTranslation("dashboard");
  const tDate = useTranslation("date").t;
  const monthShortNames = getMonthsShort(tDate);
  const monthLongNames = getMonthsLong(tDate);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const {
    tripsByMonthData,
    mostPopularMonth,
    leastPopularMonth,
    totalTripsForMonth,
  } = useTripsByMonthStats(monthLongNames);

  // Ensure all months are represented, even with zero trips
  const monthDataMap = new Map(tripsByMonthData.map((d) => [d.name, d]));
  const allMonthsData = monthLongNames.map((name, idx) => {
    const found = monthDataMap.get(name);
    const local = found?.local ?? 0;
    const abroad = found?.abroad ?? 0;
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

  const monthLabels = monthShortNames;
  const monthCounts = allMonthsData.map((d) => d.total);
  const monthColors = allMonthsData.map((d) => d.color);

  return (
    <>
      <div className="flex flex-row gap-8 justify-center items-stretch">
        {/* Pie and legend */}
        <Card
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
                    label={monthShortNames[idx] ?? d.name}
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
        </Card>
        {/* Popularity cards */}
        <div className="flex flex-col gap-4 min-w-[320px] max-w-[380px]">
          <Card
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
          </Card>
          <Card
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
          </Card>
        </div>
      </div>
      <Card
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
      </Card>
    </>
  );
}
