import { Suspense, lazy, useState } from "react";
import {
  Table,
  DashboardCard,
  SegmentedToggle,
  type SegmentedToggleOption,
} from "@components";
import { TRIP_TYPE_COLORS } from "../constants/trips";
import { YEAR_TABLE_COLUMNS } from "../constants/year";
import { useTripsByYearStats } from "../hooks/useTripsByYearStats";

const TripsBarChart = lazy(() => import("./TripsByYearBarChart"));

export function TripsByYear() {
  const { tripsByYearData } = useTripsByYearStats();
  const [filter, setFilter] = useState<"both" | "local" | "abroad">("both");

  // Define filter options for the segmented toggle
  const filterOptions: SegmentedToggleOption<"both" | "local" | "abroad">[] = [
    { value: "both", label: "Both", colorClass: "bg-blue-500 text-white" },
    { value: "local", label: "Local", colorClass: "bg-green-500 text-white" },
    {
      value: "abroad",
      label: "Abroad",
      colorClass: "bg-purple-500 text-white",
    },
  ];

  // Filter columns based on selected filter
  const filteredColumns = YEAR_TABLE_COLUMNS.filter(
    (col) =>
      col.key === "year" ||
      (filter === "both" &&
        (col.key === "local" || col.key === "abroad" || col.key === "total")) ||
      (filter === "local" && col.key === "local") ||
      (filter === "abroad" && col.key === "abroad"),
  );

  return (
    <>
      <DashboardCard title="Trips by Year">
        <SegmentedToggle
          value={filter}
          options={filterOptions}
          onChange={setFilter}
        />
        <div className="w-full h-64 mb-6">
          <Suspense fallback={<div>Loading chart...</div>}>
            <TripsBarChart
              data={tripsByYearData}
              filter={filter}
              tripTypeColors={TRIP_TYPE_COLORS}
            />
          </Suspense>
        </div>
      </DashboardCard>
      <DashboardCard title="Yearly Trip Breakdown" className="mt-6">
        <div className="overflow-x-auto">
          <Table columns={filteredColumns} data={tripsByYearData} />
        </div>
      </DashboardCard>
    </>
  );
}
