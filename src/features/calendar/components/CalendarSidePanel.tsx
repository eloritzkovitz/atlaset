import React from "react";
import DatePicker from "react-datepicker";
import { CalendarLegend } from "./CalendarLegend";
import { type TripEventFilters, type TripEventTypeKey } from "../types";
import "react-datepicker/dist/react-datepicker.css";

interface CalendarSidePanelProps {
  date: Date;
  setDate: (date: Date) => void;
  filters: TripEventFilters;
  onToggleType: (type: TripEventTypeKey) => void;
}

export const CalendarSidePanel: React.FC<CalendarSidePanelProps> = ({
  date,
  setDate,
  filters,
  onToggleType,
}) => (
  <div className="flex flex-col items-center mt-13 mr-2">
    <DatePicker
      selected={date}
      onChange={(d: Date | null) => {
        if (d) setDate(d);
      }}
      inline
      calendarClassName="rounded-lg !border-none !bg-surface-alt/30"
      dayClassName={() => "text-sm !text-text"}
    />
    <div className="items-left self-stretch">
      <CalendarLegend
        shown={{
          local: filters.local,
          abroad: filters.abroad,
          upcoming: filters.upcoming,
        }}
        onToggle={onToggleType}
      />
    </div>
  </div>
);
