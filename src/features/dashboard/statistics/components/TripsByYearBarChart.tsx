import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";

interface BarPayload {
  dataKey: string;
  name: string;
  value: number;
}

type CustomTooltipProps = TooltipProps<number, string> & {
  tripTypeColors: string[];
  payload?: readonly BarPayload[];
  label?: string | number;
  [key: string]: unknown;
};

function CustomTooltip({
  active,
  payload = [],
  label,
  tripTypeColors,
}: CustomTooltipProps) {
  if (!active || !payload.length) return null;
  return (
    <div
      style={{
        background: "#101828",
        border: "1px solid #101828",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        padding: 12,
      }}
    >
      <div style={{ color: "#2b7fff", fontWeight: 700, marginBottom: 4 }}>
        {label}
      </div>
      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          style={{
            color:
              entry.dataKey === "local" ? tripTypeColors[0] : tripTypeColors[1],
            fontWeight: 500,
            marginBottom: 2,
          }}
        >
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  );
}

interface TripsBarChartProps {
  data: Record<string, unknown>[];
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
        <Tooltip
          content={(props: TooltipProps<number, string>) => (
            <CustomTooltip {...props} tripTypeColors={tripTypeColors} />
          )}
        />
        <Legend />
        {(filter === "both" || filter === "local") && (
          <Bar
            dataKey="local"
            stackId="a"
            fill={tripTypeColors[0]}
            name="Local"
            activeBar={{ fill: "#22c55e" }}
          />
        )}
        {(filter === "both" || filter === "abroad") && (
          <Bar
            dataKey="abroad"
            stackId="a"
            fill={tripTypeColors[1]}
            name="Abroad"
            activeBar={{ fill: "#7c3aed" }}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
