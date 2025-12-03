import React from "react";

interface PieLegendCardProps {
  label: string;
  color: string;
  percentage: number;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const PieLegendCard: React.FC<PieLegendCardProps> = ({
  label,
  color,
  percentage,
  isActive,
  onMouseEnter,
  onMouseLeave,
}) => (
  <div
    className={`flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-sm transition ${
      isActive ? "scale-110 ring-2 ring-teal-400 z-10" : "hover:scale-105"
    }`}
    style={{ zIndex: isActive ? 1 : 0 }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <div
      className="w-8 h-8 rounded-full"
      style={{ backgroundColor: color }}
    ></div>
    <p className="text-sm font-medium mt-2">{label}</p>
    <p className="text-xs text-gray-500 dark:text-gray-200">
      {percentage.toFixed(1)}%
    </p>
  </div>
);
