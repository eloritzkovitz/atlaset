import { useState, useMemo, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  SegmentedToggle,
  Table,
  translateColumns,
  type SegmentedToggleOption,
} from "@components";
import {
  TRIP_TYPE_COLORS,
  TRIP_TYPE_LABELS,
  TRIP_TYPE_COLOR_CLASSES,
} from "@features/trips/constants/trips";
import { YEAR_TABLE_COLUMNS } from "../constants/statistics";
import { useTripsByYearStats } from "../hooks/useTripsByYearStats";

const TripsBarChart = lazy(() => import("./TripsByYearBarChart"));

export function YearlyTrendsSection() {
  const { t } = useTranslation("dashboard");
  const { tripsByYearData } = useTripsByYearStats();
  const [yearFilter, setYearFilter] = useState<"both" | "local" | "abroad">(
    "both",
  );

  const yearFilterOptions = useMemo<
    SegmentedToggleOption<"both" | "local" | "abroad">[]
  >(
    () => [
      {
        value: "both",
        label: t("statistics.trends.yearly.chart.toggle.both", {
          defaultValue: "Both",
        }),
        colorClass: "bg-blue-500 text-white",
      },
      {
        value: "local",
        label: t("trips:types.local", { defaultValue: TRIP_TYPE_LABELS[0] }),
        colorClass: TRIP_TYPE_COLOR_CLASSES[0],
      },
      {
        value: "abroad",
        label: t("trips:types.abroad", { defaultValue: TRIP_TYPE_LABELS[1] }),
        colorClass: TRIP_TYPE_COLOR_CLASSES[1],
      },
    ],
    [t],
  );

  const yearColumns = useMemo(
    () => translateColumns(YEAR_TABLE_COLUMNS, t),
    [t],
  );

  const filteredYearColumns = useMemo(
    () =>
      yearColumns.filter(
        (col) =>
          col.key === "year" ||
          (yearFilter === "both" &&
            (col.key === "local" ||
              col.key === "abroad" ||
              col.key === "total")) ||
          (yearFilter === "local" && col.key === "local") ||
          (yearFilter === "abroad" && col.key === "abroad"),
      ),
    [yearColumns, yearFilter],
  );

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-bold tracking-tight">
        {t("statistics.trends.yearly.title", {
          defaultValue: "Yearly trends",
        })}
      </h2>

      <Card
        title={t("statistics.trends.yearly.chart.title", {
          defaultValue: "Trips by year",
        })}
      >
        <SegmentedToggle
          value={yearFilter}
          options={yearFilterOptions}
          onChange={setYearFilter}
          className="mt-4 mb-4"
        />
        <div className="w-full h-64 mb-6">
          <Suspense
            fallback={
              <div>
                {t("statistics.loading", {
                  defaultValue: "Loading data...",
                })}
              </div>
            }
          >
            <TripsBarChart
              data={tripsByYearData}
              filter={yearFilter}
              tripTypeColors={TRIP_TYPE_COLORS}
            />
          </Suspense>
        </div>
      </Card>

      <Table
        columns={filteredYearColumns}
        data={tripsByYearData}
        striped
        showExport
        exportFilename="yearly-trends.csv"
        cardProps={{
          title: t("statistics.trends.yearly.table.title", {
            defaultValue: "Yearly trip breakdown",
          }),
        }}
      />
    </section>
  );
}
