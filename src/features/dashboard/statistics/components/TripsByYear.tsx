import { Suspense, lazy, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  SegmentedToggle,
  Table,
  type SegmentedToggleOption,
} from "@components";
import {
  TRIP_TYPE_COLORS,
  TRIP_TYPE_LABELS,
  TRIP_TYPE_COLOR_CLASSES,
} from "@features/trips/constants/trips";
import { useTripsByYearStats } from "../hooks/useTripsByYearStats";
import { YEAR_TABLE_COLUMNS } from "../constants/statistics";
import { translateColumns } from "../utils/columns";

const TripsBarChart = lazy(() => import("./TripsByYearBarChart"));

export function TripsByYear() {
  const { t } = useTranslation("dashboard");
  const { tripsByYearData } = useTripsByYearStats();
  const [filter, setFilter] = useState<"both" | "local" | "abroad">("both");

  // Define filter options for the segmented toggle using constants
  const filterOptions: SegmentedToggleOption<"both" | "local" | "abroad">[] = [
    {
      value: "both",
      label: t("statistics.year.toggle.both", { defaultValue: "Both" }),
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
  ];

  // Filter columns based on selected filter
  const columns = useMemo(() => translateColumns(YEAR_TABLE_COLUMNS, t), [t]);

  const filteredColumns = columns.filter(
    (col) =>
      col.key === "year" ||
      (filter === "both" &&
        (col.key === "local" || col.key === "abroad" || col.key === "total")) ||
      (filter === "local" && col.key === "local") ||
      (filter === "abroad" && col.key === "abroad"),
  );

  return (
    <>
      <Card
        title={t("statistics.year.title", { defaultValue: "Trips by Year" })}
      >
        <SegmentedToggle
          value={filter}
          options={filterOptions}
          onChange={setFilter}
          className="mt-4 mb-4"
        />
        <div className="w-full h-64 mb-6">
          <Suspense
            fallback={
              <div>
                {t("statistics.loadingChart", {
                  defaultValue: "Loading chart...",
                })}
              </div>
            }
          >
            <TripsBarChart
              data={tripsByYearData}
              filter={filter}
              tripTypeColors={TRIP_TYPE_COLORS}
            />
          </Suspense>
        </div>
      </Card>
      <Card
        title={t("statistics.year.breakdownTitle", {
          defaultValue: "Yearly Trip Breakdown",
        })}
        className="mt-6"
      >
        <div className="overflow-x-auto">
          <Table columns={filteredColumns} data={tripsByYearData} />
        </div>
      </Card>
    </>
  );
}
