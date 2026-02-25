import React from "react";
import { Checkbox, SectionHeader } from "@components";
import { TRIP_TYPE_COLORS, TRIP_TYPE_LABELS } from "../../trips/constants/trips";
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
        label={TRIP_TYPE_LABELS[0]}
        color={TRIP_TYPE_COLORS[0]}
      />
      <Checkbox
        checked={shown.abroad}
        onChange={() => onToggle("abroad")}
        label={TRIP_TYPE_LABELS[1]}
        color={TRIP_TYPE_COLORS[1]}
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
