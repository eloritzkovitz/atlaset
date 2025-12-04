import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Table, DashboardCard } from "@components";
import { TRIP_TYPE_COLORS } from "../../constants/trips";
import { YEAR_TABLE_COLUMNS } from "../../constants/year";
import { useTripsByYearStats } from "../../hooks/useTripsByYearStats";
import { useState } from "react";

export function TripsByYear() {
  const { tripsByYearData } = useTripsByYearStats();
  const [filter, setFilter] = useState<"both" | "local" | "abroad">("both");

  // Filter columns based on selected filter
  const filteredColumns = YEAR_TABLE_COLUMNS.filter(
    (col) =>
      col.key === "year" ||
      (filter === "both" &&
        (col.key === "local" || col.key === "abroad" || col.key === "total")) ||
      (filter === "local" && col.key === "local") ||
      (filter === "abroad" && col.key === "abroad")
  );

  return (
    <>
      <DashboardCard title="Trips by Year">
        {/* Toggle */}
        <div className="flex gap-2 mb-4 mt-6">
          <button
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              filter === "both"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            onClick={() => setFilter("both")}
          >
            Both
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              filter === "local"
                ? "bg-green-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            onClick={() => setFilter("local")}
          >
            Local
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              filter === "abroad"
                ? "bg-purple-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            onClick={() => setFilter("abroad")}
          >
            Abroad
          </button>
        </div>
        {/* Chart */}
        <div className="w-full h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tripsByYearData}>
              <XAxis dataKey="year" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              {(filter === "both" || filter === "local") && (
                <Bar
                  dataKey="local"
                  stackId="a"
                  fill={TRIP_TYPE_COLORS[0]}
                  name="Local"
                />
              )}
              {(filter === "both" || filter === "abroad") && (
                <Bar
                  dataKey="abroad"
                  stackId="a"
                  fill={TRIP_TYPE_COLORS[1]}
                  name="Abroad"
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      {/* Table */}
      <DashboardCard title="Trips per Year" className="mt-6">
        <div className="overflow-x-auto">
          <Table columns={filteredColumns} data={tripsByYearData} />
        </div>
      </DashboardCard>
    </>
  );
}
