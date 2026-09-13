import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipContentProps,
} from "recharts";
import { useTranslation } from "react-i18next";
import { TRIP_TYPE_CONFIG } from "@features/trips";
import type { YearFilter } from "../types";

function CustomTooltip(
  props: TooltipContentProps<number, string>,
  tripTypeColors: { local: string; abroad: string },
) {
  const { active, payload = [], label } = props;
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
      {payload.map((entry, idx) => (
        <div
          key={
            typeof entry.dataKey === "string" ||
            typeof entry.dataKey === "number"
              ? entry.dataKey
              : String(idx)
          }
          style={{
            color:
              entry.dataKey === "local"
                ? tripTypeColors.local
                : tripTypeColors.abroad,
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
  filter: YearFilter;
  tripTypeColors: {
    local: string;
    abroad: string;
  };
}

export default function TripsBarChart({
  data,
  filter,
  tripTypeColors,
}: TripsBarChartProps) {
  const { t } = useTranslation("dashboard");

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="year" />
        <YAxis allowDecimals={false} />
        <Tooltip
          content={(props) =>
            CustomTooltip(
              props as TooltipContentProps<number, string>,
              tripTypeColors,
            )
          }
        />
        <Legend />
        {(filter === "both" || filter === "local") && (
          <Bar
            dataKey="local"
            stackId="a"
            fill={tripTypeColors.local}
            name={t("trips:types.local", {
              defaultValue: TRIP_TYPE_CONFIG.local.label,
            })}
            activeBar={{ fill: "#22c55e" }}
          />
        )}
        {(filter === "both" || filter === "abroad") && (
          <Bar
            dataKey="abroad"
            stackId="a"
            fill={tripTypeColors.abroad}
            name={t("trips:types.abroad", {
              defaultValue: TRIP_TYPE_CONFIG.abroad.label,
            })}
            activeBar={{ fill: "#7c3aed" }}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
