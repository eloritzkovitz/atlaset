import React from "react";

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
  if (direction === "horizontal") {
    return (
      <div
        className={`flex flex-row items-center gap-2 bg-surface px-3 py-2 rounded-lg shadow-sm transition ${
          isActive ? "scale-105 ring-2 ring-teal-400 z-10" : "hover:scale-105"
        }`}
        style={{ zIndex: isActive ? 1 : 0 }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-text">{percentage.toFixed(1)}%</span>
      </div>
    );
  }

  // vertical (default)
  return (
    <div
      className={`flex flex-col items-center bg-surface p-4 rounded-lg shadow-sm transition ${
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
      <p className="text-xs text-text">{percentage.toFixed(1)}%</p>
    </div>
  );
};
