import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { ActionButton } from "@components";

interface CalendarToolbarProps {
  label: string;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY" | "DATE") => void;
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  label,
  onNavigate,
}) => (
  <div className="flex items-center justify-between mb-2">
    <ActionButton
      icon={<FaChevronLeft />}
      ariaLabel="Previous"
      title="Previous"
      rounded
      onClick={() => onNavigate("PREV")}
    />
    <span className="font-bold text-lg">{label}</span>
    <ActionButton
      icon={<FaChevronRight />}
      ariaLabel="Next"
      title="Next"
      rounded
      onClick={() => onNavigate("NEXT")}
    />
  </div>
);
