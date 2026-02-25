import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import {
  ActionButton,
  SegmentedToggle,
  type SegmentedToggleOption,
} from "@components";
import { type CalendarView } from "../types";

interface CalendarToolbarProps {
  label?: string;
  view?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  onToday?: () => void;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY" | "DATE") => void;
}

export const viewOptions: SegmentedToggleOption<CalendarView>[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  label,
  view = "month",
  onViewChange,
  onToday,
  onNavigate,
}) => (
  <div className="flex items-center gap-2 px-4 mb-2">
    {onToday && (
      <ActionButton
        onClick={onToday}
        ariaLabel="Go to Today"
        variant="primary"
        className="mt-1 text-white !rounded-full"
      >
        Today
      </ActionButton>
    )}
    <ActionButton
      icon={<FaChevronLeft />}
      ariaLabel="Previous"
      title="Previous"
      rounded
      onClick={() => onNavigate("PREV")}
    />
    {label && <span className="font-bold text-lg">{label}</span>}
    <ActionButton
      icon={<FaChevronRight />}
      ariaLabel="Next"
      title="Next"
      rounded
      onClick={() => onNavigate("NEXT")}
    />
    <div className="flex-1" />
    {onViewChange && (
      <SegmentedToggle
        value={view}
        options={viewOptions}
        onChange={onViewChange}
        className="inline-flex rounded-full bg-surface-alt/50 p-1 shadow-inner"
      />
    )}
  </div>
);
