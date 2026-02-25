import React from "react";
import { ActionButton, NumberInput, SelectInput } from "@components";
import { MONTH_OPTIONS } from "@constants/date";
import { type CalendarView } from "../../types";

interface CalendarDateControlsProps {
  month: number;
  year: number;
  onMonthChange: (val: string | number) => void;
  onYearChange: (val: string | number) => void;
  onToday?: () => void;
  minYear?: number;
  maxYear?: number;
  className?: string;
  view?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
}

export const viewOptions: { label: string; value: CalendarView }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

export const CalendarDateControls: React.FC<CalendarDateControlsProps> = ({
  month,
  year,
  onMonthChange,
  onYearChange,
  onToday,
  minYear = 1900,
  maxYear = 2100,
  className = "",
  view = "month",
  onViewChange,
}) => {
  return (
    <div className={`flex gap-2 px-4 mb-4 items-center ${className}`}>
      <SelectInput
        value={month}
        options={MONTH_OPTIONS}
        onChange={onMonthChange}
        className="w-36"
      />
      <NumberInput
        label=""
        value={year}
        onChange={onYearChange}
        min={minYear}
        max={maxYear}
        className="w-24"
      />
      {onToday && (
        <ActionButton
          onClick={onToday}
          ariaLabel="Go to Today"
          variant="primary"
          className="mt-1 ml-2"
        >
          Today
        </ActionButton>
      )}
      <div className="flex-1" />
      {onViewChange && (
        <SelectInput
          value={view}
          options={viewOptions}
          onChange={(val) => onViewChange(val as CalendarView)}
          className="w-32 ml-2"
        />
      )}
    </div>
  );
};
