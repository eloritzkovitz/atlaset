import React from "react";
import { ColorDot } from "@components";
import { TRIP_TYPE_COLORS } from "@features/dashboard/statistics/constants/trips";

function LegendRow({
  color,
  label,
  dashed,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-6 h-6 flex items-center justify-center">
        {dashed ? (
          <span
            style={{
              display: "inline-block",
              width: 24,
              height: 24,
              borderRadius: 12,
              background: "#fff",
              border: "3px dashed #cab23c",
              boxSizing: "border-box",
            }}
          />
        ) : (
          <ColorDot color={color} size={24} />
        )}
      </span>
      <label>{label}</label>
    </div>
  );
}

export const CalendarLegend: React.FC = () => (
  <div
    style={{ minWidth: 160 }}
    className="CalendarLegend flex flex-col gap-3 p-3 text-sm"
  >
    <LegendRow color={TRIP_TYPE_COLORS[0]} label={"Local trip"} />
    <LegendRow color={TRIP_TYPE_COLORS[1]} label={"Abroad trip"} />
    <LegendRow color="#fff" label="Upcoming trip" dashed />
  </div>
);
