import React from "react";
import { ActionButton, DirectionalIcon, SegmentedToggle } from "@components";
import { useScreenSize } from "@hooks";
import { viewOptions } from "../constants/calendarToolbarOptions";
import { type CalendarView } from "../types";

interface CalendarToolbarProps {
  label?: string;
  view?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  onToday?: () => void;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY" | "DATE") => void;
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  label,
  view = "month",
  onViewChange,
  onToday,
  onNavigate,
}) => {
  const { isMobile } = useScreenSize();

  if (isMobile) {
    return (
      <div className="mb-2 px-3">
        <span className="truncate text-base font-bold">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 px-2 mb-2 sm:gap-2 sm:px-4">
      {onToday && (
        <ActionButton
          onClick={onToday}
          ariaLabel="Go to Today"
          variant="primary"
          className="mt-1 !rounded-full px-3 text-sm text-white"
        >
          Today
        </ActionButton>
      )}

      <ActionButton
        icon={<DirectionalIcon direction="prev" />}
        ariaLabel="Previous"
        title="Previous"
        rounded
        onClick={() => onNavigate("PREV")}
      />

      {label && (
        <span className="min-w-0 truncate text-base font-bold sm:text-lg">
          {label}
        </span>
      )}

      <ActionButton
        icon={<DirectionalIcon direction="next" />}
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
};
