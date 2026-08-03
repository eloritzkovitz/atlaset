import React from "react";
import { formatPercent } from "@utils";

interface PieLegendCardProps {
  label: string;
  color: string;
  percentage: number;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  direction?: "vertical" | "horizontal";
}

export const PieLegendCard: React.FC<PieLegendCardProps> = ({
  label,
  color,
  percentage,
  isActive,
  onMouseEnter,
  onMouseLeave,
  direction = "vertical",
}) => {
  const isHorizontal = direction === "horizontal";
  const formattedPercent = formatPercent(percentage / 100, { decimals: 1 });

  return (
    <div
      className={`flex bg-surface rounded-lg shadow-sm transition ${
        isHorizontal
          ? "flex-row items-center gap-2 px-3 py-2"
          : "flex-col items-center p-4"
      } ${
        isActive
          ? `${isHorizontal ? "scale-105" : "scale-110"} ring-2 ring-teal-400 z-10`
          : "hover:scale-105"
      }`}
      style={{ zIndex: isActive ? 1 : 0 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`rounded-full ${isHorizontal ? "w-4 h-4" : "w-8 h-8"}`}
        style={{ backgroundColor: color }}
      />
      <span className={`text-sm font-medium ${isHorizontal ? "" : "mt-2"}`}>
        {label}
      </span>
      <span className="text-xs text-text">{formattedPercent}</span>
    </div>
  );
};
