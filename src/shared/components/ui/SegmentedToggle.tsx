import { useRef } from "react";
import { useAutoScrollFocus } from "@hooks";

export interface SegmentedToggleOption<T extends string> {
  value: T;
  label: string;
  count?: number;
  colorClass?: string;
}

interface SegmentedToggleProps<T extends string> {
  value: T;
  options: SegmentedToggleOption<T>[];
  onChange: (val: T) => void;
  className?: string;
  wrap?: boolean;
  disabled?: boolean;
  autoFocusOnSelect?: boolean;
}

export function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
  className = "",
  wrap = false,
  disabled = false,
  autoFocusOnSelect = true,
}: SegmentedToggleProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll and focus the selected option when it changes
  useAutoScrollFocus(containerRef, `[data-seg-value="${value}"]`, {
    enabled: autoFocusOnSelect,
    centerInline: true,
  });

  return (
    <div
      ref={containerRef}
      className={`flex gap-2 ${wrap ? "flex-wrap" : ""} ${className}`}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;

        const baseBg = opt.colorClass
          ? opt.colorClass.split(" ").find((c) => c.startsWith("bg-"))
          : null;
        const hoverClass = !isSelected
          ? baseBg
            ? `hover:${baseBg}/50`
            : "hover:bg-surface-hover"
          : "";

        return (
          <button
            key={opt.value}
            data-seg-value={opt.value}
            aria-pressed={isSelected}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              isSelected
                ? `${opt.colorClass || "bg-primary"} text-white`
                : `bg-surface ${hoverClass}`
            }`}
            onClick={() => onChange(opt.value)}
            disabled={disabled}
          >
            {opt.label}
            {typeof opt.count === "number" && (
              <span className="ml-1 text-xs text-muted align-middle">
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
