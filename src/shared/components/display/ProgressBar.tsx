import type { CSSProperties } from "react";

export type ProgressBarSize = "sm" | "md" | "lg";

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  size?: ProgressBarSize;
  colorClassName?: string;
  className?: string;
  animated?: boolean;
}

const SIZE_CLASSES: Record<ProgressBarSize, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

/** Renders a progress bar. */
export function ProgressBar({
  value,
  max,
  label,
  size = "md",
  colorClassName = "bg-primary",
  className = "",
  animated = true,
}: ProgressBarProps) {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  const safeMax = Number.isFinite(max) ? Math.max(0, max) : 0;

  const percentage =
    safeMax > 0 ? Math.min(100, (safeValue / safeMax) * 100) : 0;

  const fillStyle: CSSProperties = {
    width: `${percentage}%`,
  };

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
      className={[
        SIZE_CLASSES[size],
        "w-full overflow-hidden rounded-full bg-surface",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "h-full rounded-full",
          colorClassName,
          animated
            ? "transition-[width] duration-500 ease-out motion-reduce:transition-none"
            : "transition-none",
        ]
          .filter(Boolean)
          .join(" ")}
        style={fillStyle}
      />
    </div>
  );
}
