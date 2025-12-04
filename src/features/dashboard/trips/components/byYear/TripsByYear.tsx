import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Table, type TableColumn, DashboardCard } from "@components";
import { TRIP_TYPE_COLORS } from "../../constants/trips";
import { useTripsByYearStats } from "../../hooks/useTripsByYearStats";
import { useState } from "react";

// Helper to get table columns based on filter
const getYearTableColumns = (
  filter: "both" | "local" | "abroad"
): TableColumn[] => [
  { key: "year", label: "Year" },
  ...(filter === "both" || filter === "local"
    ? [{ key: "local", label: "Local" }]
    : []),
  ...(filter === "both" || filter === "abroad"
    ? [{ key: "abroad", label: "Abroad" }]
    : []),
  ...(filter === "both" ? [{ key: "total", label: "Total" }] : []),
];

export function TripsByYear() {
  const { tripsByYearData } = useTripsByYearStats();
  const [filter, setFilter] = useState<"both" | "local" | "abroad">("both");

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
          <Table columns={getYearTableColumns(filter)} data={tripsByYearData} />
        </div>
      </DashboardCard>
    </>
  );
}
