import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TripsBarChartProps {
  data: unknown[];
  filter: "both" | "local" | "abroad";
  tripTypeColors: string[];
}

export default function TripsBarChart({
  data,
  filter,
  tripTypeColors,
}: TripsBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="year" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        {(filter === "both" || filter === "local") && (
          <Bar
            dataKey="local"
            stackId="a"
            fill={tripTypeColors[0]}
            name="Local"
          />
        )}
        {(filter === "both" || filter === "abroad") && (
          <Bar
            dataKey="abroad"
            stackId="a"
            fill={tripTypeColors[1]}
            name="Abroad"
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
