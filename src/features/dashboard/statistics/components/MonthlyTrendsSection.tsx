import { useState, useMemo, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { FaCrown } from "react-icons/fa6";
import { Card, Chip, PieLegendCard, Table } from "@components";
import { useScreenSize } from "@hooks";
import { getMonthsShort, getMonthsLong } from "@utils/date";
import { MONTH_TABLE_COLUMNS } from "../constants/statistics";
import { useTripsByMonthStats } from "../hooks/useTripsByMonthStats";
import { translateColumns } from "../utils/columns";

const PieChart = lazy(() => import("@components/display/PieChart/PieChart"));

export function MonthlyTrendsSection() {
  const { isLaptop } = useScreenSize();
  const { t } = useTranslation("dashboard");
  const tDate = useTranslation("date").t;

  const monthShortNames = useMemo(() => getMonthsShort(tDate), [tDate]);
  const monthLongNames = useMemo(() => getMonthsLong(tDate), [tDate]);
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number | null>(null);

  const {
    allMonthsData,
    mostPopularMonth,
    leastPopularMonth,
    totalTripsForMonth,
  } = useTripsByMonthStats(monthLongNames);

  const monthColumns = useMemo(
    () => translateColumns(MONTH_TABLE_COLUMNS, t),
    [t],
  );

  const monthCounts = useMemo(
    () => allMonthsData.map((d) => d.total),
    [allMonthsData],
  );
  const monthColors = useMemo(
    () => allMonthsData.map((d) => d.color),
    [allMonthsData],
  );

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-bold tracking-tight">
        {t("statistics.trends.monthly.title", {
          defaultValue: "Monthly trends",
        })}
      </h2>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Monthly Pie & Legend */}
        <Card
          title={t("statistics.trends.monthly.chart.title", {
            defaultValue: "Trips by month",
          })}
          className="flex-1 w-full"
        >
          {monthShortNames.length > 0 ? (
            <div
              className={`mt-4 flex flex-col sm:flex-row items-center justify-center ${
                isLaptop ? "gap-10" : "gap-16"
              } min-h-[220px]`}
            >
              <div
                className={`flex flex-col items-center justify-center w-full ${
                  isLaptop ? "sm:max-w-[280px]" : "max-w-[320px]"
                }`}
              >
                <Suspense
                  fallback={
                    <div className="text-muted text-sm">
                      {t("statistics.loading", {
                        defaultValue: "Loading data...",
                      })}
                    </div>
                  }
                >
                  <PieChart
                    labels={monthShortNames}
                    data={monthCounts}
                    colors={monthColors}
                    hoveredIdx={hoveredMonthIdx}
                    setHoveredIdx={setHoveredMonthIdx}
                    size={isLaptop ? 280 : 340}
                  />
                </Suspense>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 justify-center w-full sm:w-auto">
                {allMonthsData.map((d, idx) => (
                  <PieLegendCard
                    key={d.name}
                    label={monthShortNames[idx] ?? d.name}
                    color={d.color}
                    percentage={d.percentage}
                    isActive={hoveredMonthIdx === idx}
                    onMouseEnter={() => setHoveredMonthIdx(idx)}
                    onMouseLeave={() => setHoveredMonthIdx(null)}
                    direction="horizontal"
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted text-sm">
              {t("statistics.noData", {
                defaultValue: "No trip data available.",
              })}
            </p>
          )}
        </Card>

        {/* Popularity Side Cards */}
        <div className="flex flex-col gap-4 w-full lg:max-w-[340px]">
          <Card
            title={t("statistics.trends.monthly.mostPopular.title", {
              defaultValue: "Most Popular Month",
            })}
          >
            <Chip className="bg-surface font-semibold px-3 py-2 text-base gap-2 w-full justify-between sm:justify-start">
              <span className="flex items-center gap-2">
                <FaCrown className="text-yellow-500 text-lg shrink-0" />
                {mostPopularMonth?.name ?? "—"}
              </span>
              {mostPopularMonth && (
                <span className="text-muted font-normal text-sm ms-2">
                  ({mostPopularMonth.total}{" "}
                  {t("statistics.trends.monthly.trips", { defaultValue: "trips" })},{" "}
                  {totalTripsForMonth > 0
                    ? `${Math.round(mostPopularMonth.percentage)}%`
                    : "0%"}
                  )
                </span>
              )}
            </Chip>
          </Card>

          <Card
            title={t("statistics.trends.monthly.leastPopular.title", {
              defaultValue: "Least Popular Month",
            })}
          >
            <Chip className="bg-surface font-semibold px-3 py-2 text-base gap-2 w-full justify-between sm:justify-start">
              <span>{leastPopularMonth?.name ?? "—"}</span>
              {leastPopularMonth && (
                <span className="text-muted font-normal text-sm ms-2">
                  ({leastPopularMonth.total}{" "}
                  {t("statistics.trends.monthly.trips", { defaultValue: "trips" })},{" "}
                  {totalTripsForMonth > 0
                    ? `${Math.round(leastPopularMonth.percentage)}%`
                    : "0%"}
                  )
                </span>
              )}
            </Chip>
          </Card>
        </div>
      </div>

      <Card
        title={t("statistics.trends.monthly.table.title", {
          defaultValue: "Monthly trip breakdown",
        })}
      >
        <div className="overflow-x-auto">
          <Table columns={monthColumns} data={allMonthsData} />
        </div>
      </Card>
    </section>
  );
}
