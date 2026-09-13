import React from "react";
import { Checkbox, SectionHeader } from "@components";
import { TRIP_TYPE_CONFIG } from "@features/trips";
import { type TripEventTypeKey } from "../types";

interface CalendarLegendProps {
  shown: Record<TripEventTypeKey, boolean>;
  onToggle: (type: TripEventTypeKey) => void;
}

export const CalendarLegend: React.FC<CalendarLegendProps> = ({
  shown,
  onToggle,
}) => (
  <div className="CalendarLegend min-w-[160px] flex flex-col p-3 text-sm">
    <SectionHeader title="Trips" />
    <div className="flex flex-col gap-3 mt-1">
      <Checkbox
        checked={shown.local}
        onChange={() => onToggle("local")}
        label={TRIP_TYPE_CONFIG.local.label}
        color={TRIP_TYPE_CONFIG.local.color}
      />
      <Checkbox
        checked={shown.abroad}
        onChange={() => onToggle("abroad")}
        label={TRIP_TYPE_CONFIG.abroad.label}
        color={TRIP_TYPE_CONFIG.abroad.color}
      />
      <Checkbox
        checked={shown.upcoming}
        onChange={() => onToggle("upcoming")}
        label="Upcoming"
        color={"#cab23c"}
      />
    </div>
  </div>
);
